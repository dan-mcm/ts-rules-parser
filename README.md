# TS Rules.ini Parser

This script will convert rules.ini to JSON format to enable easier React/JS site/app creation from the generated rules.json file.

Initialy developed for use with the Fading Dusk mod.

## Running Project 
You can run the project locally with the command `npm run start`. (requires node installed locally). This will convert the included rules.ini file to a rules.json file outputted in the same directory.

There is an included rules.json output included for reference.

## Rules.ini setup
* rules.ini must be present within this project directory
* a certain formatting is expected in order to correctly parse the file, see details below

### Rules.ini format
There is an expected format in order to get this script to work with your rules.ini file.

The majority of the file parsing occurs at the [VehicleTypes] section of the rules.ini.

1. Faction Subheadings
Under this header it is expected to use subfaction specific subheadings in a format such as:

```
;---------------------------------------------------
;[S/F: GDI = GDI main faction]
;---------------------------------------------------
GDI1V00=GHARV		;;GDI Harvester
GDI1V00B=GHORV		;;GDI Harvester, unloading
GDI1V00C=HHARV		;;Moebius (Hover) Harvester
```

These faction specific subheadings are hardcoded in index.js 'factions' const variable and can be changed manually.

```javascript
const factions = [
    ";[S/F: GDI = GDI main faction]",
    ";[S/F: GDRR = GDI Rapid Response]",
    ";[S/F: GDSC = GDI Space Command]",
    ";[S/F: Nod = Nod main faction]",
    ";[S/F: NDCyber = Nod Heavy Cyber]",
    ";[S/F: NDBH = Nod Black Hand]",
    ";[S/F: For3 = Forgotten Hofati]",
    ";[S/F: Forgotten = Forgotten main faction]",
    ";[S/F: Militia = City-State Militia main faction]"
]
```

Note that the parser expects no spaces between entries under a faction subheading, if a break is detected, that faction will be considered completed. (simply a limitation of how the parser currently reads the file).

2. Unit Details

There are 4 main key/values parsed:

```javascript
{
    "code":"GDI1V00",
    "name":"GDI Harvester",
    "description":null,
    "raw":"GDI1V00=GHARV\t\t;;GDI Harvester"
}
```
* `code` value is taken based on parsing the initial equals sign below subfaction subtitled entires
* `name` value is taken based on value directly beside the ;; of an entry
* `description` value is taken based on the presence of a hypon with space either side i.e. `GDI1V00=GHARV ;;GDI Harvester - Unit Description Here`
* `raw` value is how the string appears in the actual rules.ini file, primarily used for debugging