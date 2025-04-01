FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
RUN apt install -y nodejs npm
COPY ["GamebookPilar.Server/GamebookPilar.Server.csproj", "GamebookPilar.Server/"]
COPY ["gamebookpilar.client/gamebookpilar.client.esproj", "gamebookpilar.client/"]
RUN dotnet restore "GamebookPilar.Server/GamebookPilar.Server.csproj"
COPY . .
WORKDIR "/src/GamebookPilar.Server"
RUN dotnet build "GamebookPilar.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "GamebookPilar.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GamebookPilar.Server.dll"]
