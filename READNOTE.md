# Collection des Requêtes API du Projet Finamix

Ce document recense les requêtes importantes du projet Finamix qui commencent par `http://localhost:5551/api/`. Il inclut également l'analyse des propriétés (DTOs) utiles pour les requêtes `POST` ou `PUT`/`PATCH`, ainsi que la réponse JSON attendue (basée sur le schéma Prisma).

---

## 1. Module Dataset (`/api/datasets`)
**Fonctionnalité DTO** : `CreateDatasetDto` et `UpdateDatasetDto` valident le champ `name` du Dataset (chaîne de caractères non vide).

### 1.1 Créer un Dataset
- **Méthode** : `POST`
- **URL** : `http://localhost:5551/api/datasets`
- **JSON Attendu dans le corps (Body)** :
```json
{
  "name": "Dataset Global 2024"
}
```
- **Réponse JSON Attendue** :
```json
{
	"id": 1,
	"name": "Dataset Global 2025",
	"indicateur": null,
	"initiatives": null
}
```
- **Reponse JSON en cas d'erreur**:
```json
{
	"message": "Un dataset avec le nom 'Dataset Global 2024' existe déjà",
	"error": "Bad Request",
	"statusCode": 400
}
```

### 1.2 Récupérer tous les Datasets
- **Méthode** : `GET`
- **URL** : `http://localhost:5551/api/datasets`
- **Réponse JSON Attendue** (Exemple de liste) :
```json
 [
		{
			"id": 1,
			"name": "Dataset Global 2025",
			"indicateur": null,
			"initiatives": null
		},
		{
			"id": 2,
			"name": "Dataset Global 2023",
			"indicateur": null,
			"initiatives": null
		},
		{
			"id": 3,
			"name": "Dataset Finance 2024",
			"indicateur": null,
			"initiatives": null
		}
	],
```

### 1.3 Récupérer le détail d'un Dataset
- **Méthode** : `GET`
- **URL** : `http://localhost:5551/api/datasets/1` 
- **Réponse JSON Attendue** :
```json
{
	"id": 1,
	"name": "Dataset Global 2025",
	"indicateur": null,
	"initiatives": null
}
```

### 1.4 Modifier un Dataset
- **Méthode** : `PUT`
- **URL** : `http://localhost:5551/api/datasets/1`
- **JSON Attendu dans le corps (Body)** :
```json
{
  "name": "Dataset Global 2025"
}
```
- **Réponse JSON Attendue** :
```json
{
	"id": 1,
	"name": "Dataset Global 2026",
	"indicateur": null,
	"initiatives": null
}
```

### 1.5 Supprimer un Dataset
- **Méthode** : `DELETE`
- **URL** : `http://localhost:5551/api/datasets/2`
- **Réponse JSON Attendue** (en cas de succès) :
```json
{
			"id": 2,
			"name": "Dataset Finance 2025",
			"indicateur": null,
			"initiatives": null
		}
```
> [!WARNING]
> **Contrainte de suppression (Prisma `onDelete: Restrict`)** : Vous ne pouvez pas supprimer un Dataset s'il est déjà lié à un Indicateur (via la table `DatasetIndicateur`) ou s'il possède des `Initiative`s associées. Si vous essayez, l'API renverra une erreur (généralement `500 Internal Server Error` ou `400 Bad Request` selon la gestion d'erreur de NestJS) indiquant une violation de contrainte de clé étrangère. Il faut d'abord supprimer les liaisons ou initiatives associées.

---

## 2. Module Indicateur (`/api/indicateur`)
**Fonctionnalité DTO** : `CreateIndicateurDTO` et `UpdateIndicateurDTO` valident les champs `code`, `label` et `type` en tant que chaînes de caractères.

### 2.1 Créer un Indicateur
- **Méthode** : `POST`
- **URL** : `http://localhost:5551/api/indicateur`
- **JSON Attendu dans le corps (Body)** :
```json
{
  "code": "sme24jiej",
  "label": "Taux de croissance",
  "type": "Financier"
}
```
- **Réponse JSON Attendue** :
```json
{
	"id": 1,
	"code": "sme24jiej",
	"label": "Taux de croissance",
	"type": "Financier",
	"datasetId": null,
	"dataset": null
}
```
- **Reponse JSON en cas d'erreur**:
``` json 
{
	"statusCode": 500,
	"message": "Internal server error"
}

### 2.2 Récupérer tous les Indicateurs
- **Méthode** : `GET`
- **URL** : `http://localhost:5551/api/indicateur`
- **Réponse JSON Attendue** :
```json
[
	{
		"id": 1,
		"code": "sme24jiej",
		"label": "Taux de croissance",
		"type": "Financier",
		"datasetId": null,
		"dataset": null
	},
	{
		"id": 2,
		"code": "sme24ji4p",
		"label": "Taux de decroissance",
		"type": "Financier",
		"datasetId": null,
		"dataset": null
	},
	{
		"id": 3,
		"code": "7je24ji4p",
		"label": "Taux de decroissance",
		"type": "Financier",
		"datasetId": null,
		"dataset": null
	}
]
```

### 2.3 Récupérer un Indicateur spécifique
- **Méthode** : `GET`
- **URL** : `http://localhost:5551/api/indicateur/3`
- **Réponse JSON Attendue** :
```json
{
	"id": 3,
	"code": "7je24ji4p",
	"label": "Taux de decroissance",
	"type": "Financier",
	"datasetId": null,
	"dataset": null
}
```

### 2.4 Modifier un Indicateur
- **Méthode** : `PUT`
- **URL** : `http://localhost:5551/api/indicateur/3`
- **JSON Attendu dans le corps (Body)** :
```json
{
  "code": "7je24ji4p",
  "label": "Taux de croissance modifié",
  "type": "Performance"
}
```
- **Réponse JSON Attendue** :
```json
{
	"id": 3,
	"code": "7je24ji4p",
	"label": "Taux de croissance modifié",
	"type": "Performance",
	"datasetId": null,
	"dataset": null
}
```

### 2.5 Supprimer un Indicateur
- **Méthode** : `DELETE`
- **URL** : `http://localhost:5551/api/indicateur/1`
- **Réponse JSON Attendue** (en cas de succès) :
```json
{
	"id": 1,
	"code": "sme24jiej",
	"label": "Taux de croissance",
	"type": "Financier",
	"datasetId": null,
	"dataset": null
}
```

---

## 3. Module Initiative (`/api/initiative`)
**Fonctionnalité DTO** : `CreateInitiativeDTO` et `UpdateInitiativeDTO` valident les champs `nom`, `periode` et `datasetId`.

### 3.1 Créer une Initiative
- **Méthode** : `POST`
- **URL** : `http://localhost:5551/api/initiative`
- **JSON Attendu dans le corps (Body)** :
```json
{
  "nom": "Programme écho 2024",
  "periode": "Q1 2024",
  "datasetId": 1
}
```
- **Réponse JSON Attendue** :
```json
{
	"id": 1,
	"nom": "Programme écho 2024",
	"periode": "Q1 2024",
	"datasetId": 1,
	"dataset": {
		"id": 1,
		"name": "Dataset Global 2026"
	}
}
```

- **Reponse JSON en cas d'erreur** :
```json 
{
	"message": "initiative with name 'Programme écho 2024' already exists",
	"error": "Bad Request",
	"statusCode": 400
}

### 3.2 Récupérer toutes les Initiatives
- **Méthode** : `GET`
- **URL** : `http://localhost:5551/api/initiative`
- **Réponse JSON Attendue** :
```json
[
	{
		"id": 1,
		"nom": "Programme écho 2024",
		"periode": "Q1 2024",
		"datasetId": 1,
		"dataset": {
			"id": 1,
			"name": "Dataset Global 2026"
		}
	},
	{
		"id": 2,
		"nom": "Programme écho 2025",
		"periode": "Q2 2025",
		"datasetId": 3,
		"dataset": {
			"id": 3,
			"name": "Dataset Finance 2024"
		}
	}
]
```

### 3.3 Récupérer une Initiative spécifique
- **Méthode** : `GET`
- **URL** : `http://localhost:5551/api/initiative/1`
- **Réponse JSON Attendue** :
```json
{
	"id": 1,
	"nom": "Programme écho 2024",
	"periode": "Q1 2024",
	"datasetId": 1,
	"dataset": {
		"id": 1,
		"name": "Dataset Global 2026"
	}
}
```

### 3.4 Modifier une Initiative
- **Méthode** : `PUT`
- **URL** : `http://localhost:5551/api/initiative/1`
- **JSON Attendu dans le corps (Body)** :
```json
{
  "nom": "Programme écho 2024 modifié",
  "periode": "Q2 2024",
  "datasetId": 1
}
```
- **Reponse JSON en cas d'erreur**
```json
{
	"message": [
		"il ne doit pas etre vide",
		"c'est un entier"
	],
	"error": "Bad Request",
	"statusCode": 400
}
```

### 3.5 Supprimer une Initiative
- **Méthode** : `DELETE`
- **URL** : `http://localhost:5551/api/initiative/1`
- **Réponse JSON Attendue** :
```json
{
	"id": 1,
	"nom": "Programme écho 2024",
	"periode": "Q1 2024",
	"datasetId": 1
}
```


