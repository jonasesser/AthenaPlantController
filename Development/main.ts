import * as alt from  'alt-server';
import { BlipController } from '../../server/systems/blip';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { updatePlants } from './database';

const defaultSettings = {
    plantSystemEnabled: true,
    plantUpdateInterval: 5000,
}

const blipSettings = {
    sprite: 620,
    color: 2,
    scale: 1,
    shortRange: true,
    text: 'Weed-Plant Spot'
}
/** 
 * An Array All the valid plant placing spots are going here.
 * @type {alt.Vector3} 
 * @memberof main
 */
const plantSpots: alt.Vector3[] = [
    {"x":-1625.6290283203125,"y":3165.891357421875,"z":29.933713912963867} as alt.Vector3,
];

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, loadAllPlants);
function loadAllPlants() {
    if(!defaultSettings.plantSystemEnabled) return false;

    alt.setInterval(() => {
        updatePlants();
    }, defaultSettings.plantUpdateInterval);

    plantSpots.forEach((plantSpot, index) => {
        BlipController.append({
            sprite: blipSettings.sprite, 
            color:  blipSettings.color,
            scale:  blipSettings.scale,
            text: blipSettings.text,
            shortRange: blipSettings.shortRange,
            uid: `Blip-${index}`,
            pos: plantSpots[index],
        });
    });

    return true;
};