let constructor = require("../constructor.js");
let library = require("../library/status.js");

let info = {
  id: "inuzukaKiba",
  name: "Inuzuka Kiba"
};

let status = {
  invulnerable: library.invulnerable({
    owner: info.id
  }),
  disableDrIv: library.disableDrIv({
    owner: info.id,
    active: 3
  }),
  stun: library.stun({
    owner: info.id
  }),
  protect: library.protect({
    val: 15,
    owner: info.id,
    active: 3
  }),
  bleed: library.bleed({
    val: 15,
    active: 3,
    owner: info.id,
    persistence: "action"
  }),
  boost: {
    name: "Dynamic Marking",
    owner: info.id,
    val: 5,
    type: "skill",
    active: 3,
    modify: function(payload) {
      if (
        payload.offense.skill[payload.skill].name === "Double-Headed Wolf" ||
        payload.offense.skill[payload.skill].name === "Garouga"
      ) {
        payload.val += this.val;
      }
    }
  },
  energy: {
    owner: info.id,
    active: 4,
    modify: function(payload) {
      let index = payload.offense.skill.findIndex(x => x.name === "Garouga");
      if (index !== -1) {
        if (payload.active > 1) {
          payload.offense.skill[index].energy.r = 0;
          console.log("KIBA Start", payload.active);
        } else if (payload.active === 1) {
          payload.offense.skill[index].energy.r = 1;
          console.log("KIBA", payload.active);
        }
      }
    }
  }
};

let skills = {
  skill1: {
    name: "Garouga",
    type: "attack",
    val: 30,
    cooldown: 0,
    classes: ["instant", "melee", "physical"],
    energy: {
      a: 1,
      r: 1
    },
    description:
      "This skill does 30 damage to one enemy. During 'Double-Headed Wolf' this skill is improved and costs 1 less random chakra.",
    move: function(payload) {
      payload.target.hp -= payload.val;
    }
  },
  skill2: {
    name: "Double-Headed Wolf",
    type: "attack",
    val: 15,
    cooldown: 3,
    classes: ["action", "melee", "physical"],
    description:
      "Kiba and Akamaru turn into giant beasts attacking all enemies dealing 15 damage each turn for 3 turns. The following 3 turns 'Garouga' is improved and costs 1 less random chakra.* During this time Kiba gains 15 points of damage reduction.",
    energy: {
      a: 1,
      i: 1
    },
    target: "allenemy",
    move: function(payload) {
      if (payload.recursive === 0) {
        payload.offense.status.onReceive.push(
          new constructor.status(status.protect, this, this.name, this.nameId, 2)
        );
        payload.offense.status.onSelf.push(
          new constructor.status(status.energy, this, this.name, this.nameId, 2)
        );
      }
      payload.target.status.onSelf.push(
        new constructor.status(status.bleed, this, this.name, this.nameId, 2)
      );
    }
  },
  skill3: {
    name: "Dynamic Marking",
    type: "attack",
    val: 10,
    cooldown: 0,
    classes: ["instant", "ranged", "affliction"],
    description:
      "Akamaru sprays urine on one enemy who cannot reduce damage or become invulnerable for 3 turns. During this time, 'Double-Headed Wolf' and 'Garouga' will deal 5 additional damage to them. Dynamic Marking cannot be used on an enemy already being affected.",
    target: "enemy",
    marking: true,
    energy: {},
    move: function(payload) {
      payload.target.status.onReceive.push(
        new constructor.status(status.boost, this, this.name, this.nameId, 3)
      );
      payload.target.status.onState.push(
        new constructor.status(status.disableDrIv, this, this.name, this.nameId, 3)
      );
    }
  },
  skill4: {
    name: "Smoke Bomb",
    type: "invulnerable",
    val: 10,
    cooldown: 4,
    description: "This skill makes Inuzuka Kiba invulnerable for 1 turn.",
    target: "self",
    classes: ["instant", "physical"],
    energy: {
      r: 1
    },
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.invulnerable, this, this.name, this.nameId, 4)
      );
    }
  }
};

let character = {
  name: info.name,
  id: info.id,
  hp: 100,
  skill: [skills.skill1, skills.skill2, skills.skill3, skills.skill4]
};

module.exports = character;
