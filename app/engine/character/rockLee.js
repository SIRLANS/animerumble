let constructor = require("../constructor.js");
let library = require("../library/status.js");
let skill = require("../library/skill.js");
let helper = require("../helper.js");

let info = {
  id: "rockLee",
  name: "Rock Lee",
  anime: "Naruto",
  author: "",
  pictures: ""
};

let status = {
  invulnerable: library.invulnerable({}),
  invulnerable2: library.invulnerable({
    active: 3
  }),
  bleed: library.bleed({
    val: 10,
    active: 3
  }),
  bleed2: library.bleed({
    val: 25,
    active: 3
  }),
  protect: library.protect({
    val: 10,
    active: 3
  }),
  reduce2: library.reduce({
    val: 15,
    active: 1
  }),
  boost1: library.boost({
    val: 30,
    harmful: false,
    active: 2,
    modify: function(payload, self) {
      if (payload.skill.name === "Front Lotus") {
        payload.val += this.val;
      }
    }
  }),
  boost2: library.boost({
    val: 10,
    harmful: false,
    active: 3,
    modify: function(payload, self) {
      if (payload.skill.name === "Front Lotus") {
        payload.val += this.val;
      }
    }
  }),
  state: library.state({
    name: "Fifth Gate Opening",
    active: 2,
    harmful: false
  }),
  transform: {
    name: "Transform",
    active: 3,
    harmful: false,
    modify: function(payload, self) {
      if (payload.active === 3) {
        let swap = payload.offense.skill[2];
        payload.offense.skill[2] = payload.offense.skill[4];
        payload.offense.skill[4] = swap;
      } else if (payload.active === 1) {
        let swap = payload.offense.skill[2];
        payload.offense.skill[2] = payload.offense.skill[4];
        payload.offense.skill[4] = swap;
      }
    }
  }
};

let skills = {
  skill1: {
    name: "High Speed Taijutsu",
    type: "attack",
    val: 0,
    cooldown: 0,
    classes: ["action", "melee", "physical"],
    energy: {
      a: 1
    },
    target: "enemy",
    description:
      "Lee deals 10 damage to one enemy for 3 turns. The following 3 turns, Lee will gain 10 points of damage reduction and that enemy will receive an additional 10 damage from 'Front Lotus'.* This skill stacks and will deal 15 additional damage during 'Fifth Gate Opening'",
    move: function(payload, self) {
      let state = payload.offense.status.onState.some(
        x => x.name === "Fifth Gate Opening"
      );
      if (state) {
        skill.pushStatus({
          subject: payload.target,
          onStatus: "onSelf",
          status: status.bleed2,
          inherit: this
        });
      } else {
        skill.pushStatus({
          subject: payload.target,
          onStatus: "onSelf",
          status: status.bleed,
          inherit: this
        });
      }
      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onReceive",
        status: status.protect,
        inherit: this
      });
      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onAttack",
        status: status.boost2,
        inherit: this
      });
    }
  },
  skill2: {
    name: "Front Lotus",
    type: "attack",
    val: 30,
    cooldown: 0,
    classes: ["instant", "melee", "physical"],
    description:
      "Opening the first gate, Lee uses a high powered taijutsu to deal 30 damage to one enemy. This skill will deal 30 additional damage during 'Fifth Gate Opening'.",
    energy: {
      a: 1,
      r: 1
    },
    target: "enemy",
    move: function(payload, self) {
      skill.damage({
        subject: payload.target,
        val: payload.val
      });
    }
  },
  skill3: {
    name: "Fifth Gate Opening",
    cooldown: 4,
    harmful: false,
    alt: 4,
    description:
      "Lee removes all harmful effects on him, losing 50 health*, and then becoming invulnerable to all harmful skills for 2 turns. The following 2 turns, this skill will be replaced by 'Final Lotus'. The affliction damage this skill deals cannot be ignored and cannot kill Lee.",
    target: "self",
    classes: ["instant", "mental"],
    energy: {
      a: 1
    },
    move: function(payload, self) {
      skill.pushStatus({
        subject: payload.target,
        onStatus: "onAttack",
        status: status.boost1,
        inherit: this
      });
      skill.pushStatus({
        subject: payload.target,
        onStatus: "onSelf",
        status: status.transform,
        inherit: this
      });
      skill.pushStatus({
        subject: payload.target,
        onStatus: "onState",
        status: status.invulnerable2,
        inherit: this
      });
      skill.pushStatus({
        subject: payload.target,
        onStatus: "onState",
        status: status.state,
        inherit: this
      });
      payload.target.hp -= 50;
      if (payload.target.hp <= 0) {
        payload.target.hp = 5;
      }

      skill.removeStatus(
        {
          subject: payload.target
        },
        "harmful"
      );
    }
  },
  skill4: {
    name: "Lee Block",
    type: "invulnerable",
    cooldown: 4,
    description: "This skill makes Rock Lee invulnerable for 1 turn.",
    target: "self",
    classes: ["instant", "physical"],
    energy: {
      r: 1
    },
    move: function(payload, self) {
      skill.pushStatus({
        subject: payload.target,
        onStatus: "onState",
        status: status.invulnerable,
        inherit: this
      });
    }
  },
  skill5: {
    name: "Final Lotus",
    type: "attack",
    val: 100,
    cooldown: 0,
    alt: 2,
    description:
      "Lee uses his strongest ability, expending all his chakra and dealing 100 damage to one enemy.",
    target: "enemy",
    classes: ["instant", "melee", "physical"],
    energy: {
      a: 2
    },
    move: function(payload, self) {
      skill.damage({
        subject: payload.target,
        val: payload.val
      });
    }
  }
};

let character = {
  name: info.name,
  id: info.id,
  anime: info.anime,
  credit: {
    author: info.author,
    pictures: info.pictures
  },
  hp: 100,
  skill: [
    skills.skill1,
    skills.skill2,
    skills.skill3,
    skills.skill4,
    skills.skill5
  ]
};

module.exports = character;
