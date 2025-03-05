using System.Text;
using GamebookPilar.Server.Data;
using GamebookPilar.Server.Models;
using Microsoft.AspNetCore.Mvc;

public class State
{
    public int CurrentLocation { get; set; }
    public int Sanity { get; set; }
    public string CigarettesTaken { get; set; }
    public string CandlesTaken { get; set; }
    public string PagesTaken { get; set; }
    public string KeysTaken { get; set; }
    public string SwitchesFlipped { get; set; }
    public int CigarettesSmoked { get; set; }
}

public class Encoder
{
    // Converts a number to a binary string of a specified length
    public static string NumToBin(int num, int range)
    {
        string binary = Convert.ToString(num, 2);
        return binary.PadLeft(range, '0');
    }

    // Decodes a binary string into a number
    public static int BinToNum(string binaryStr)
    {
        return Convert.ToInt32(binaryStr, 2);
    }

    // Encodes playerState, gameState, and inventory into a single binary string
    public static string StateToBin(State state)
    {
        StringBuilder rtn = new StringBuilder();

        rtn.Append(NumToBin(state.CurrentLocation, 8));
        rtn.Append(NumToBin(state.Sanity, 3));
        rtn.Append(state.CigarettesTaken); // 10 bits
        rtn.Append(state.CandlesTaken);   // 5 bits
        rtn.Append(state.PagesTaken);     // 3 bits
        rtn.Append(state.KeysTaken);      // 9 bits
        rtn.Append(state.SwitchesFlipped);// 9 bits
        rtn.Append(NumToBin(state.CigarettesSmoked, 4)); // 4 bits

        return rtn.ToString();
    }

    // Decodes a binary string back into the playerState, gameState, and inventory
    public static State BinToState(string bin)
    {
        int index = 5;

        int selectedLocation = BinToNum(bin.Substring(index, 8));
        index += 8;

        int sanity = BinToNum(bin.Substring(index, 3));
        index += 3;

        string cigarettesTaken = bin.Substring(index, 10);
        index += 10;

        string candlesTaken = bin.Substring(index, 5);
        index += 5;

        string pagesTaken = bin.Substring(index, 3);
        index += 3;

        string keysTaken = bin.Substring(index, 9);
        index += 9;

        string switchesFlipped = bin.Substring(index, 9);
        index += 9;

        int cigarettesSmoked = BinToNum(bin.Substring(index, 4));
        index += 4;

        return new State
        {
            CurrentLocation = selectedLocation,
            Sanity = sanity,
            CigarettesTaken = cigarettesTaken,
            CandlesTaken = candlesTaken,
            PagesTaken = pagesTaken,
            KeysTaken = keysTaken,
            SwitchesFlipped = switchesFlipped,
            CigarettesSmoked = cigarettesSmoked
        };
    }

    // Converts a binary string into a Base64 string
    public static string BinaryToBase64(string binaryStr)
    {
        int paddedLength = (int)Math.Ceiling(binaryStr.Length / 8.0) * 8;
        string paddedBinaryStr = binaryStr.PadLeft(paddedLength, '0');

        byte[] byteArray = new byte[paddedBinaryStr.Length / 8];
        for (int i = 0; i < paddedBinaryStr.Length; i += 8)
        {
            byteArray[i / 8] = (byte)BinToNum(paddedBinaryStr.Substring(i, 8));
        }

        return Convert.ToBase64String(byteArray);
    }

    // Converts a Base64 string into a binary string
    public static string Base64ToBinary(string base64Str)
    {
        byte[] byteArray = Convert.FromBase64String(base64Str);
        StringBuilder binaryStr = new StringBuilder();

        foreach (byte b in byteArray)
        {
            binaryStr.Append(Convert.ToString(b, 2).PadLeft(8, '0'));
        }

        return binaryStr.ToString();
    }

    // Encodes the state to Base64
    public static string Encode(State state)
    {
        string bin = StateToBin(state);
        return BinaryToBase64(bin);
    }

    // Decodes the state from Base64
    public static State Decode(string text)
    {
        string bin = Base64ToBinary(text);
        return BinToState(bin);
    }
}

namespace GamebookPilar.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StateController : Controller
    {
        private readonly AppDbContext _context;

        public StateController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/State/Move/pwfkjwofkw/1/
        [HttpGet("Move/{gameKey}/{moveButtonId}")]
        public async Task<ActionResult<string>> ExecMoveButton(string gameKey, int moveButtonId)
        {
            State decodedState = Encoder.Decode(gameKey);
            var selectedMoveButton = await _context.MoveButtons.FindAsync(moveButtonId);
            if (selectedMoveButton != null)
            {
                if (selectedMoveButton.LocationId == decodedState.CurrentLocation)
                {
                    var selectedTargetLocation =
                        await _context.Locations.FindAsync(selectedMoveButton.TargetLocationId);
                    if (selectedTargetLocation != null)
                    {
                        decodedState.CurrentLocation = selectedMoveButton.TargetLocationId;
                        if (!selectedMoveButton.StaminaFree) 
                        {
                            decodedState.Sanity -= 1;
                            if (selectedTargetLocation.IsLit)
                            {
                                decodedState.Sanity = 5;
                            }

                            if (selectedTargetLocation.SwitchIndex != null)
                            {
                                var switchIndex = selectedTargetLocation.SwitchIndex.Value;
                                if (decodedState.SwitchesFlipped[switchIndex] == '1')
                                {
                                    decodedState.Sanity = 5;
                                    decodedState.CurrentLocation = selectedMoveButton.TargetLocationId;
                                }
                            }
                        }
                    }

                }
            }

            gameKey = Encoder.Encode(decodedState);
            return $"\"{gameKey}\"";
        }
        
        // GET: api/State/Move/pwfkjwofkw/1/
        [HttpGet("Smoke/{gameKey}")]
        public async Task<ActionResult<string>> ExecSmoke(string gameKey)
        {
            State decodedState = Encoder.Decode(gameKey);
            var currentCigarettes = -decodedState.CigarettesSmoked;
            foreach (var bit in decodedState.CigarettesTaken)
            {
                if (bit == '1') 
                {
                    currentCigarettes += 1;
                }
            }
            if (currentCigarettes > 0)
            {
                decodedState.CigarettesSmoked += 1;
                decodedState.Sanity = 5;
            }
            gameKey = Encoder.Encode(decodedState);
            return $"\"{gameKey}\"";
        }

        [HttpGet("Switch/{gameKey}/{switchId}")]
        public async Task<ActionResult<string>> ExecSwitch(string gameKey, int switchId)
        {
            State decodedState = Encoder.Decode(gameKey);
            Switch selectedSwitch = await _context.Switches.FindAsync(switchId);

            if (selectedSwitch != null && decodedState.Sanity > 0)
            {
                decodedState.SwitchesFlipped = decodedState.SwitchesFlipped.Substring(0, selectedSwitch.SwitchIndex) +
                                               "1" + decodedState.SwitchesFlipped.Substring(selectedSwitch.SwitchIndex +
                                                   1);
                decodedState.Sanity -= 1;
            }

            gameKey = Encoder.Encode(decodedState);
            return $"\"{gameKey}\"";
        }

        [HttpGet("Search/{gameKey}/")]
        public async Task<ActionResult<string>> ExecSearchRoom(string gameKey)
        {
            State decodedState = Encoder.Decode(gameKey);
            Location selectedLocation = await _context.Locations.FindAsync(decodedState.CurrentLocation);

            if (selectedLocation != null)
            {
                // Helper method to update the item state string
                string UpdateItemState(string itemState, int itemIndex)
                {
                    return itemState.Substring(0, itemIndex) + "1" + itemState.Substring(itemIndex + 1);
                }

                switch (selectedLocation.ContainedItem)
                {
                    case 0:
                        decodedState.CigarettesTaken = UpdateItemState(decodedState.CigarettesTaken, selectedLocation.ItemIndex.Value);
                        break;
                    case 1:
                        decodedState.CandlesTaken = UpdateItemState(decodedState.CandlesTaken, selectedLocation.ItemIndex.Value);
                        break;
                    case 2:
                        decodedState.PagesTaken = UpdateItemState(decodedState.PagesTaken, selectedLocation.ItemIndex.Value);
                        break;
                    case 3:
                        decodedState.KeysTaken = UpdateItemState(decodedState.KeysTaken, selectedLocation.ItemIndex.Value);
                        break;
                }

                if (decodedState.Sanity > 0)
                {
                    decodedState.Sanity -= 1;
                }
            }
            
            gameKey = Encoder.Encode(decodedState);
            return $"\"{gameKey}\"";
        }
    }
}

