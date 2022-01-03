import * as alt from 'alt-server';
import {
    PLANTCONTROLLER_DATABASE,
    PLANTCONTROLLER_SETTINGS,
    PLANTCONTROLLER_SPOTS,
    PLANTCONTROLLER_TRANSLATIONS,
} from '../index';
import { Item } from '../../../shared/interfaces/item';
import { getVectorInFrontOfPlayer } from '../../../server/utility/vector';
import { PlantController } from '../PlantController';
import Database from '@stuyk/ezmongodb';
import IPlants from './interfaces/IPlants';
import { ITEM_TYPE } from '../../../shared/enums/itemTypes';
import { playerFuncs } from '../../../server/extensions/Player';

/**
 * When the player clicks on the Plant Pot in inventory, the server will create a new pot for the
player.
 */
alt.on('PlantController:Server:CreatePot', async (player: alt.Player, data: Item) => {
    const vectorInFront = getVectorInFrontOfPlayer(player, 1);
    const emptySlot = playerFuncs.inventory.getFreeInventorySlot(player);
    const allPlants = await Database.fetchAllData<IPlants>(PLANTCONTROLLER_DATABASE.collectionName);
    for (let i = 0; i < allPlants.length; i++) {
        if (player.pos.isInRange(allPlants[i].position, 2)) {
            alt.log(player.pos.isInRange(allPlants[i].position, 2));
            return;
        }
    }
    if (!PLANTCONTROLLER_SETTINGS.allowInterior) {
        if (player.data.interior != '0' && player.dimension != 0) return;
    }

    if (PLANTCONTROLLER_SETTINGS.useSpots) {
        for (let i = 0; i < PLANTCONTROLLER_SPOTS.length; i++) {
            if (player.pos.isInRange(PLANTCONTROLLER_SPOTS[i], PLANTCONTROLLER_SETTINGS.distanceToSpot)) {
                PlantController.addPlant(player, {
                    model: PLANTCONTROLLER_SETTINGS.smallPot,
                    shaIdentifier: PlantController.generateShaId(player),
                    data: {
                        owner: player.data.name,
                        variety: '',
                        type: '',
                        seeds: false,
                        fertilized: false,
                        state: PLANTCONTROLLER_TRANSLATIONS.seedsRequired,
                        remaining: 1337, // Don't touch. Different Times for Different Seeds? ;)
                        startTime: 1337, // Don't touch.
                        water: 0,
                        harvestable: false,
                    },
                    position: { x: vectorInFront.x, y: vectorInFront.y, z: vectorInFront.z - 1 } as alt.Vector3,
                });
            } else {
                return;
            }
        }
    }
});
