import {
  AUGMENTATIONS,
  AUGMENTATION_MAX_USES,
  LUMINANCE_AURA_MAX_USES,
  LUMINANCE_AURAS,
  UNTRAINED_STATE } from "../constants";
import {
  State,
  Race,
  Gender,
  Attribute,
  Vital,
  Skill,
  Training,
  LuminanceAura,
  Augmentation
} from "../types";
import DefaultCharacter from "./DefaultCharacter";
import firebase from "../firebase";
import "firebase/firestore";

export default {
  // UI toggles
  toggleAttributesPane(state: State) {
    state.ui.paneVisibility.attributes = !state.ui.paneVisibility.attributes;
  },
  toggleSkillsPane(state: State) {
    state.ui.paneVisibility.skills = !state.ui.paneVisibility.skills;
  },
  toggleAugmentationsPane(state: State) {
    state.ui.paneVisibility.augmentations = !state.ui.paneVisibility.augmentations;
  },
  toggleAurasPane(state: State) {
    state.ui.paneVisibility.auras = !state.ui.paneVisibility.auras;
  },
  toggleBuildStagesPane(state: State) {
    state.ui.paneVisibility.buildStages = !state.ui.paneVisibility.buildStages;
  },
  toggleCharacterPane(state: State) {
    state.ui.paneVisibility.character = !state.ui.paneVisibility.character;
  },
  toggleXPAndLuminancePane(state: State) {
    state.ui.paneVisibility.xpAndLuminance = !state.ui.paneVisibility.xpAndLuminance;
  },
  toggleKnobsAndDialsPane(state: State) {
    state.ui.paneVisibility.knobsAndDials = !state.ui.paneVisibility.knobsAndDials;
  },
  toggleExtraSkillCreditsPane(state: State) {
    state.ui.paneVisibility.extraSkillCredits = !state.ui.paneVisibility.extraSkillCredits;
  },
  changeStage(state: State, index: number) {
    state.ui.currentStage = index;
    state.build.character = JSON.parse(JSON.stringify(state.build.stages[index]));
  },
  saveStage(state: State) {
    state.build.stages.push(JSON.parse(JSON.stringify(state.build.character)));
  },
  deleteStage(state: State, index: number) {
    // Stop if out of bounds
    if (index > state.build.stages.length) {
      return;
    }

    state.ui.currentStage = null;
    state.build.stages.splice(index, 1);
  },
  saveBuild(state: State) {
    // Store locally
    state.ui.savedBuilds.push({
      key: new Date().toISOString(),
      build: JSON.stringify(state.build)
    });

    // Also store to firebase
    const db = firebase.firestore();
    db.collection("builds").add(state.build);
  },
  deleteBuild(state: State, key: string) {
    for (let i = 0; i < state.ui.savedBuilds.length; i++) {
      if (state.ui.savedBuilds[i].key === key) {
        state.ui.savedBuilds.splice(i, 1);
      }
    }
  },
  deleteAllBuilds(state: State) {
    state.ui.savedBuilds = [];
  },
  reset(state: State) {
    state.build.character = DefaultCharacter();
    state.build.stages = [];
  },
  updateName(state: State, value: string) {
    state.build.character.name = value;
  },
  updateLevel(state: State, value: number) {
    state.build.character.level = Number(value);
  },
  updateRace(state: State, value: Race) {
    state.build.character.race = value;

    // Also update experience augmentations to match new race
    if (
      value === Race.Aluvian ||
      value === Race["Gharu'ndim"] ||
      value === Race.Sho ||
      value === Race.Viamontian
    ) {
      state.build.character.augmentations.jack_of_all_trades.invested = 1;
      state.build.character.augmentations.infused_life_magic.invested = 0;
      state.build.character.augmentations.eye_of_the_remorseless.invested = 0;
      state.build.character.augmentations.might_of_the_seventh_mule.invested = 0;
      state.build.character.augmentations.hand_of_the_remorseless.invested = 0;
    } else if (value === Race.Empyrean) {
      state.build.character.augmentations.jack_of_all_trades.invested = 0;
      state.build.character.augmentations.infused_life_magic.invested = 1;
      state.build.character.augmentations.eye_of_the_remorseless.invested = 0;
      state.build.character.augmentations.might_of_the_seventh_mule.invested = 0;
      state.build.character.augmentations.hand_of_the_remorseless.invested = 0;
    } else if (
      value === Race.Umbraen ||
      value === Race.Penumbraen
    ) {
      state.build.character.augmentations.jack_of_all_trades.invested = 0;
      state.build.character.augmentations.infused_life_magic.invested = 0;
      state.build.character.augmentations.eye_of_the_remorseless.invested = 1;
      state.build.character.augmentations.might_of_the_seventh_mule.invested = 0;
      state.build.character.augmentations.hand_of_the_remorseless.invested = 0;
    } else if (
      value === Race.Lugian
    ) {
      state.build.character.augmentations.jack_of_all_trades.invested = 0;
      state.build.character.augmentations.infused_life_magic.invested = 0;
      state.build.character.augmentations.eye_of_the_remorseless.invested = 0;
      state.build.character.augmentations.might_of_the_seventh_mule.invested = 1;
      state.build.character.augmentations.hand_of_the_remorseless.invested = 0;
    } else if (
      value === Race.Tumerok
    ) {
      state.build.character.augmentations.jack_of_all_trades.invested = 0;
      state.build.character.augmentations.infused_life_magic.invested = 0;
      state.build.character.augmentations.eye_of_the_remorseless.invested = 0;
      state.build.character.augmentations.might_of_the_seventh_mule.invested = 0;
      state.build.character.augmentations.hand_of_the_remorseless.invested = 1;
    }
  },
  updateGender(state: State, value: Gender) {
    state.build.character.gender = value;
  },

  updateTimesEnlightened(state: State, value: number) {
    let actual = Number(value);

    if (isNaN(actual)) {
      actual = 0;
    } else if (actual < 0) {
      actual = 0;
    } else if (actual > 5) {
      actual = 5;
    }

    state.build.character.timesEnlightened = actual;
  },

  updateExtraSkillCredit(state: State, payload: any) {
    state.build.character.extraSkillCredits[payload.name] = payload.value;

    // Set luminance aura skill points to match
    if (payload.name === "luminance1" || payload.name === "luminance2") {
      state.build.character.luminance_auras.skill.invested =
        state.build.character.extraSkillCredits["luminance1"] +
        state.build.character.extraSkillCredits["luminance2"];
    }
  },

  updateAttributeCreation(state: State, payload: any) {
    let newVal = Number(payload.value);

    // Clamp to be from 10-100
    if (newVal > 100) {
      newVal = 100;
    } else if (newVal < 10) {
      newVal = 10
    }

    // Ensure we haven't spent more than 330 points and adjust other
    // attributes if needed
    let newSpent = Object.keys(Attribute).map(a => {
      // Don't count old value for the attribute we're changing, use the new
      // value
      if (a === payload.name) {
        return newVal;
      } else {
        return state.build.character.attributes[a].creation;
      }
    }).reduce((a, v) => {
      return a + v;
    });

    // Use this to iterate over the other attributes we're lowering by name
    let names = Object.keys(Attribute).filter(v => v !== payload.name);

    if (newSpent > 330) {
      let extra = newSpent - 330;

      for (var i = 0; i < extra; i++) {
        // Don't reduce attributes below 10. Adding 1 to `extra` ensures
        // we iterate long enough to lower everything as much as is needed
        if (state.build.character.attributes[names[i % 4]].creation <= 10) {
          extra += 1;
          continue;
        }

        state.build.character.attributes[names[i % 4]].creation -= 1;
      }
    }

    state.build.character.attributes[payload.name].creation = newVal;
  },

  updateAttributeInvested(state: State, payload: any) {
    state.build.character.attributes[payload.name].invested = Number(payload.value);
  },

  updateAttributeBuff(state: State, payload: any) {
    state.build.character.attributes[payload.name].buff = Number(payload.value);
  },

  updateAttributeCantrip(state: State, payload: any) {
    state.build.character.attributes[payload.name].cantrip = Number(payload.value);
  },

  updateVitalInvested(state: State, payload: any) {
    state.build.character.vitals[payload.name].invested = Number(payload.value);
  },

  updateVitalBuff(state: State, payload: any) {
    state.build.character.vitals[payload.name].buff = Number(payload.value);
  },

  updateVitalCantrip(state: State, payload: any) {
    state.build.character.vitals[payload.name].cantrip = Number(payload.value);
  },

  updateSkillInvested(state: State, payload: { name: string, value: number}) {
    state.build.character.skills[payload.name].invested = payload.value;
  },

  updateSkillBuff(state: State, payload: any) {
    state.build.character.skills[payload.name].buff = Number(payload.value);
  },

  updateSkillCantrip(state: State, payload: any) {
    state.build.character.skills[payload.name].cantrip = Number(payload.value);
  },

  increaseTraining(state: State, skill: Skill) {
    const currentTraining = state.build.character.skills[skill].training;
    var newTraining = null;

    switch (currentTraining) {
      case Training.UNUSABLE:
        newTraining = Training.TRAINED;
        break;
      case Training.UNTRAINED:
        newTraining = Training.TRAINED;
        break;
      case Training.TRAINED:
        newTraining = Training.SPECIALIZED;
        break;
      default:
        return;
    }

    state.build.character.skills[skill].training = newTraining;
  },

  decreaseTraining(state: State, skill: Skill) {
    const currentTraining = state.build.character.skills[skill].training;
    var newTraining = null;

    switch (currentTraining) {
      case Training.SPECIALIZED:
        newTraining = Training.TRAINED;

        // Reduce max skill invested to 208 (max for trained) if over
        if (state.build.character.skills[skill].invested > 208) {
          state.build.character.skills[skill].invested = 208;
        }

        break;
      case Training.TRAINED:
        newTraining = UNTRAINED_STATE[skill];
        state.build.character.skills[skill].invested = 0;

        break;
      default:
        return;
    }

    state.build.character.skills[skill].training = newTraining;
  },

  // Augmentations
  updateAugmentationInvested(state: State, payload: any) {
    state.build.character.augmentations[payload.name].invested = Number(payload.value);

    /* Update skills */

    if (payload.name === "jibrils_essence") {
      state.build.character.skills.armor_tinkering.training = Training.SPECIALIZED;
    } else if (payload.name === "yoshis_essence") {
      state.build.character.skills.item_tinkering.training = Training.SPECIALIZED;
    } else if (payload.name === "celdiseths_essence") {
      state.build.character.skills.magic_item_tinkering.training = Training.SPECIALIZED;
    } else if (payload.name === "kogas_essence") {
      state.build.character.skills.weapon_tinkering.training = Training.SPECIALIZED;
    } else if (payload.name === "ciandras_essence") {
      state.build.character.skills.salvaging.training = Training.SPECIALIZED;
    }
  },

  changeAllAugmentationInvestment(state: State, value: number) {
    AUGMENTATIONS.forEach((aug_name: string) => {
      state.build.character.augmentations[aug_name].invested = (value == 1 ? AUGMENTATION_MAX_USES[aug_name] : 0);
    });
  },

  // Luminance Auras
  updateLuminanceAuraInvested(state: State, payload: any) {
    state.build.character.luminance_auras[payload.name].invested = Number(payload.value);
  },

  changeAllLuminanceAuraInvestment(state: State, value: any) {
    LUMINANCE_AURAS.forEach((aura_name: string) => {
      state.build.character.luminance_auras[aura_name].invested = (value == 1 ? LUMINANCE_AURA_MAX_USES[aura_name] : 0);
    });
  },

  changeAllInvestment(state: State, invested: string) {
    Object.keys(Attribute).forEach(a => {
      let newval = Number(invested);
      newval = newval > 190 ? 190 : newval;

      state.build.character.attributes[a].invested = newval;
    });

    Object.keys(Vital).forEach(a => {
      let newval = Number(invested);
      newval = newval > 196 ? 196 : newval;

      state.build.character.vitals[a].invested = newval;
    });

    Object.keys(Skill).forEach(skill => {
      let newval = Number(invested);

      if (
        state.build.character.skills[skill].training == Training.SPECIALIZED
      ) {
        state.build.character.skills[skill].invested = newval > 226 ? 226 : newval;
      } else if (
        state.build.character.skills[skill].training == Training.TRAINED
      ) {
        state.build.character.skills[skill].invested = newval > 208 ? 208 : newval;
      }
    });
  },

  changeAllAttributeInvestment(state: State, invested: string) {
    Object.keys(Attribute).forEach(a => {
      let newval = Number(invested);

      state.build.character.attributes[a].invested = newval;
    });
  },

  changeAllVitalInvestment(state: State, invested: string) {
    Object.keys(Vital).forEach(a => {
      let newval = Number(invested);

      state.build.character.vitals[a].invested = newval;
    });
  },

  changeAllSkillInvestment(state: State, invested: string) {
    Object.keys(Skill).forEach(skill => {
      let newval = Number(invested);

      if (
        state.build.character.skills[skill].training == Training.TRAINED
      ) {
        newval = newval > 208 ? 208 : newval;
      }

      state.build.character.skills[skill].invested = newval;
    });
  },

  changeAllBuffs(state: State, buff: string) {
    Object.keys(Attribute).forEach(attribute => {
      state.build.character.attributes[attribute].buff = Number(buff);
    });

    Object.keys(Vital).forEach(vital => {
      state.build.character.vitals[vital].buff = Number(buff);
    });

    Object.keys(Skill).forEach(skill => {
      state.build.character.skills[skill].buff = Number(buff);
    });
  },

  changeAllAttributeBuffs(state: State, buff: string) {
    Object.keys(Attribute).forEach(attribute => {
      state.build.character.attributes[attribute].buff = Number(buff);
    });
  },

  changeAllVitalBuffs(state: State, buff: string) {
    Object.keys(Vital).forEach(vital => {
      state.build.character.vitals[vital].buff = Number(buff);
    });
  },

  changeAllSkillBuffs(state: State, buff: string) {
    Object.keys(Skill).forEach(skill => {
      state.build.character.skills[skill].buff = Number(buff);
    });
  },

  // Cantrips
  changeAllCantrips(state: State, cantrip: string) {
    Object.keys(Attribute).forEach(attribute => {
      state.build.character.attributes[attribute].cantrip = Number(cantrip);
    });

    Object.keys(Vital).forEach(vital => {
      state.build.character.vitals[vital].cantrip = Number(cantrip);
    });

    Object.keys(Skill).forEach(skill => {
      state.build.character.skills[skill].cantrip = Number(cantrip);
    });
  },

  changeAllAttributeCantrips(state: State, cantrip: string) {
    Object.keys(Attribute).forEach(attribute => {
      state.build.character.attributes[attribute].cantrip = Number(cantrip);
    });
  },

  changeAllVitalCantrips(state: State, cantrip: string) {
    Object.keys(Vital).forEach(vital => {
      state.build.character.vitals[vital].cantrip = Number(cantrip);
    });
  },

  changeAllSkillCantrips(state: State, cantrip: string) {
    Object.keys(Skill).forEach(skill => {
      state.build.character.skills[skill].cantrip = Number(cantrip);
    });
  },

  // Notifications
  clearAllNotifications(state: State) {
    state.ui.notifications = [];
  },

  addNotification(state: State, payload: any) {
    let notification_id = Date.now();

    state.ui.notifications.push({
      id: notification_id,
      type: payload.type,
      message: payload.message
    });

    setTimeout(() => {
      for (let i = 0; i < state.ui.notifications.length; i++) {
        if (state.ui.notifications[i].id === notification_id) {
          state.ui.notifications.splice(i, 1);
        }
      }
    }, 3000);
  },

  removeNotification(state: State, id: number) {
    for (let i = 0; i < state.ui.notifications.length; i++) {
      if (state.ui.notifications[i].id === id) {
        state.ui.notifications.splice(i, 1);
      }
    }
  }
};
