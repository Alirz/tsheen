# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
RUN --mount=type=bind,source=NuGet.Config,target=/context/NuGet.Config,ro --mount=type=bind,source=common.props,target=/context/common.props,ro --mount=type=bind,source=src,target=/context/src,ro --mount=type=bind,source=docker/scrub-appsettings.py,target=/tmp/scrub-appsettings.py,ro <<'EOS'
set -eu
apt-get update
apt-get install -y --no-install-recommends python3
cp /context/NuGet.Config /context/common.props ./
cp -a /context/src ./src
find src -name '*.pfx' -delete
python3 /tmp/scrub-appsettings.py src
cat > src/Directory.Build.targets <<'EOF'
<Project>
  <ItemGroup>
    <Content Remove="**/*.pfx" />
    <None Remove="**/*.pfx" />
    <Content Remove="**/appsettings.secrets.json" />
    <None Remove="**/appsettings.secrets.json" />
  </ItemGroup>
</Project>
EOF
dotnet publish src/Tsheen.DbMigrator/Tsheen.DbMigrator.csproj -c Release -o /app/publish --no-self-contained
find /app/publish \( -name '*.pfx' -o -name 'appsettings.secrets.json' \) -delete
python3 /tmp/scrub-appsettings.py /app/publish
rm -rf src
rm -rf /var/lib/apt/lists/*
EOS

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /app/Logs
ENTRYPOINT ["dotnet", "Tsheen.DbMigrator.dll"]
