let constructor = require("../constructor.js");
let library = require("../library/status.js");

let info = {
  id: "uzumakiNaruto",
  name: "Uzumaki Naruto"
};

let status = {
  invulnerable: library.invulnerable({
    owner: info.id
  }),
  stun: library.stun({
    owner: info.id
  }),
  protect: library.protect({
    val: 15,
    owner: info.id,
    active: 4
  }),
  bleed: library.bleed({
    val: 5,
    owner: info.id
  }),
  boost: {
    name: "Shadow Clones",
    owner: info.id,
    val: 10,
    type: "skill",
    active: 4,
    modify: function(payload) {
      if (
        payload.offense.skill[payload.skill].name === "Uzumaki Naruto Combo"
      ) {
        payload.val += this.val;
      }
    }
  },
  required: {
    owner: info.id,
    active: 4,
    modify: function(payload) {
      let index = payload.offense.skill.findIndex(x => x.name === "Rasengan");
      if (index !== -1) {
        if (payload.active > 1) {
          payload.offense.skill[index].required = false;
          console.log("ZERO", payload.active);
        } else if (payload.active === 1) {
          payload.offense.skill[index].required = true;
          console.log("LAST", payload.active);
        }
      }
    }
  }
};

let skills = {
  skill1: {
    name: "Uzumaki Naruto Combo",
    type: "attack",
    val: 20,
    cooldown: 0,
    classes: ["instant", "melee", "physical"],
    energy: {
      a: 1
    },
    description:
      "Naruto's version of the Lion Combo. This skill deals 20 damage to one enemy. During 'Shadow Clones' this skill will deal 10 additional damage.",
    move: function(payload) {
      payload.target.hp -= payload.val;
    }
  },
  skill2: {
    name: "Rasengan",
    type: "attack",
    val: 45,
    cooldown: 1,
    description:
      "Naruto hits one enemy with a ball of chakra dealing 45 damage to them and stunning their skills for 1 turn. This skill requires 'Shadow Clones'.",
    required: true,
    classes: ["instant", "melee", "chakra"],
    energy: {
      s: 1,
      r: 1
    },
    target: "enemy",
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.stun, this.name, this.nameId, 2)
      );
      payload.target.hp -= payload.val;
    }
  },
  skill3: {
    name: "Shadow Clones",
    type: "attack",
    val: 10,
    cooldown: 3,
    description:
      "Naruto creates multiple shadow clones hiding his true self. Naruto gains 15 points of damage reduction for 4 turns. During this time 'Uzumaki Naruto Combo' will deal 10 additional damage and 'Rasengan' can be used.",
    target: "self",
    classes: ["instant", "chakra"],
    energy: {
      r: 1
    },
    move: function(payload) {
      payload.target.status.onSelf.push(
        new constructor.status(status.required, this.name, this.nameId, 3)
      );
      payload.target.status.onReceive.push(
        new constructor.status(status.protect, this.name, this.nameId, 3)
      );
      payload.target.status.onAttack.push(
        new constructor.status(status.boost, this.name, this.nameId, 3)
      );
    }
  },
  skill4: {
    name: "Sexy Technique",
    type: "invulnerable",
    val: 10,
    cooldown: 4,
    description: "This skill makes Uzumaki Naruto invulnerable for 1 turn.",
    target: "self",
    classes: ["instant", "chakra"],
    energy: {
      r: 1
    },
    move: function(payload) {
      payload.target.status.onState.push(
        new constructor.status(status.invulnerable, this.name, this.nameId, 4)
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
