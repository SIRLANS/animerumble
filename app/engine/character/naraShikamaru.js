let constructor = require("../constructor.js");
let library = require("../library/status.js");

let info = {
  id: "naraShikamaru",
  name: "Nara Shikamaru"
};

let status = {
  invulnerable: library.invulnerable({
    owner: info.id
  }),
  disableDrIv: library.disableDrIv({
    owner: info.id,
    active: 1
  }),
  disableDrIv2: library.disableDrIv({
    owner: info.id,
    active: 2
  }),
  state: library.state({
    name: "Meditate",
    active: 5,
    owner: info.id
  }),
  stun2: library.stun({
    owner: info.id,
    active: 2,
    info: "declusive",
    classes: ["mental"],
    persistence: "control"
  }),
  stun: library.stun({
    owner: info.id,
    active: 1,
    info: "declusive",
    classes: ["mental"],
    persistence: "control"
  }),
  protect: library.protect({
    val: 15,
    owner: info.id
  }),
  bleed2: library.bleed({
    val: 15,
    active: 2,
    owner: info.id
  }),
  bleed: library.bleed({
    val: 15,
    active: 1,
    owner: info.id
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
    name: "Meditate",
    type: "attack",
    val: 30,
    cooldown: 0,
    marking: true,
    energy: {},
    classes: ["instant", "ranged", "mental"],
    description:
      "Shikamaru sits down and begins thinking up a strategy against one enemy for 5 turns. This skill cannot be countered or reflected and cannot used on an enemy already affected by it.",
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.state, this, this.name, this.nameId, 1)
      );
    }
  },
  skill2: {
    name: "Shadow-Neck Bind",
    type: "attack",
    val: 15,
    cooldown: 1,
    classes: ["action", "ranged", "chakra"],
    description:
      "Shikamaru chokes all enemies, dealing 15 damage to them and making them unable to reduce damage or become invulnerable for 1 turn. If an enemy is affected by 'Meditate', this skill will last 2 turns instead.",
    energy: {
      w: 1
    },
    target: "allenemy",
    move: function(payload) {
      // console.log("KIBA", payload);
      if (payload.target.status.onState.some(x => x.name === "Meditate")) {
        payload.target.status.onSelf.push(
          new constructor.status(status.bleed2, this, this.name, this.nameId, 2)
        );
        payload.target.status.onState.push(
          new constructor.status(status.disableDrIv2, this, this.name, this.nameId, 2)
        );
      } else {
        payload.target.status.onSelf.push(
          new constructor.status(status.bleed, this, this.name, this.nameId, 2)
        );
        payload.target.status.onState.push(
          new constructor.status(status.disableDrIv, this, this.name, this.nameId, 2)
        );
      }
      // payload.target.hp -= payload.val;
    }
  },
  skill3: {
    name: "Shadow Imitation",
    type: "attack",
    val: 10,
    cooldown: 3,
    classes: ["control", "ranged", "chakra"],
    description:
      "Shikamaru captures all enemy in shadows, stunning their non-mental skills for 1 turn. Enemies affected by 'Meditate' will instead have their non-mental skills stunned for 2 turns.",
    target: "allenemy",
    energy: {
      w: 1,
      r: 1
    },
    move: function(payload) {
      if (payload.target.status.onState.some(x => x.name === "Meditate")) {
        payload.target.status.onState.push(
          new constructor.status(status.stun2, this, this.name, this.nameId, 3)
        );
      } else {
        payload.target.status.onState.push(
          new constructor.status(status.stun, this, this.name, this.nameId, 3)
        );
      }
    }
  },
  skill4: {
    name: "Shikamaru Hide",
    type: "invulnerable",
    val: 10,
    cooldown: 4,
    description: "This skill makes Nara Shikamaru invulnerable for 1 turn.",
    target: "self",
    classes: ["instant", "mental"],
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
