# DynamoDB Migration Guide

## 🎯 Objetivo

Migrar los datos actualizados de las temporadas 2024-25 y 2025-26 desde los CSV files a DynamoDB en AWS.

## 📋 Pre-requisitos

1. **AWS CLI configurado** con el perfil correcto
2. **Credenciales AWS** con permisos para DynamoDB
3. **Python dependencies** instaladas (`boto3`, `pandas`)

## 🚀 Paso 1: Verificar el estado actual de DynamoDB

Antes de migrar, verifica qué datos hay actualmente:

```bash
cd /Users/franortiz/Dev/nba-player-comparison/backend

# Para dev (tabla: nba-player-stats-dev)
AWS_PROFILE=tu-perfil python scripts/verify_dynamodb.py nba-player-stats-dev

# Para prod (tabla: nba-player-stats-prod)
AWS_PROFILE=tu-perfil python scripts/verify_dynamodb.py nba-player-stats-prod
```

## 🔄 Paso 2: Ejecutar la migración

### Para **DEV**:

```bash
cd /Users/franortiz/Dev/nba-player-comparison/backend

AWS_PROFILE=tu-perfil venv/bin/python scripts/migrate_to_dynamodb.py \
  ./data \
  nba-player-stats-dev \
  2024_25,2025_26
```

### Para **PROD**:

```bash
cd /Users/franortiz/Dev/nba-player-comparison/backend

AWS_PROFILE=tu-perfil venv/bin/python scripts/migrate_to_dynamodb.py \
  ./data \
  nba-player-stats-prod \
  2024_25,2025_26
```

**Argumentos:**
- `./data`: Directorio donde están los CSV files
- `nba-player-stats-{stage}`: Nombre de la tabla DynamoDB
- `2024_25,2025_26`: Temporadas a migrar (separadas por coma)

## ✅ Paso 3: Verificar la migración

Después de migrar, verifica que los datos estén correctamente cargados:

```bash
# Verificar dev
AWS_PROFILE=tu-perfil python scripts/verify_dynamodb.py nba-player-stats-dev

# Verificar prod
AWS_PROFILE=tu-perfil python scripts/verify_dynamodb.py nba-player-stats-prod
```

**Output esperado:**
```
Season 2024_25: 735 players
  Sample player: Shai Gilgeous-Alexander
  Team: OKC
  PTS: 32.7

Season 2025_26: 670 players
  Sample player: Luka Dončić
  Team: LAL
  PTS: 32.7
```

## 🔧 Troubleshooting

### Error: "Unable to locate credentials"

```bash
# Verifica tu perfil AWS
aws configure list-profiles

# Configura las credenciales si es necesario
aws configure --profile tu-perfil
```

### Error: "Table does not exist"

El script crea la tabla automáticamente si no existe. Si hay error, verifica los permisos IAM.

### Error: "Rate exceeded"

DynamoDB tiene límites de escritura. El script procesa de 100 en 100. Si hay problemas, puedes reducir el batch size en el código.

## 📊 Datos a migrar

- **2024-25**: 735 jugadores (temporada completa)
- **2025-26**: 670 jugadores (temporada en curso)
- **Total**: 1,405 registros

## 🎯 Post-migración

Después de migrar a PROD, el backend de Lambda automáticamente usará los datos nuevos. No necesitas redesplegar el Lambda.

Verifica en producción:
```bash
curl https://tu-api-url/players/seasons
```

Debería devolver:
```json
["2025_26", "2024_25", ...]
```
