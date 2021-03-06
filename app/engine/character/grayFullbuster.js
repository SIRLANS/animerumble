let constructor = require("../constructor.js");
let library = require("../library/status.js");
let skill = require("../library/skill.js");
let helper = require("../helper.js");

let info = {
  id: "grayFullbuster",
  name: "Gray Fullbuster",
  anime: "FairyTail",
  author: "63k",
  pictures: "Leciel"
};

let status = {
  invulnerable: library.invulnerable({}),
  stun: library.stun({}),
  stun2: library.stun({
    active: 2
  }),
  dd: library.dd({
    val: 25,
    callback: function(payload, self) {
      payload.target.status.onState = payload.target.status.onState.filter(
        x => x.type !== "ignore" && x.nameId !== self.nameId
      );
    }
  }),
  dd2: library.dd({
    val: 50,
    callback: function(payload, self) {
      payload.target.status.onState = payload.target.status.onState.filter(
        x => x.type !== "ignore" && x.nameId !== self.nameId
      );
    }
  }),
  ignore: library.ignore({
    active: -1
  }),
  bleed: library.bleed({
    val: 20
  }),
  boost: library.boost({
    isStack: true,
    val: 5,
    active: -1
  }),
  boost2: library.boost({
    isStack: true,
    val: 10,
    active: -1
  }),
  state: library.state({
    active: -1
  }),
  state2: library.state({
    name: "Ice Make: Geyser",
    active: -1
  }),
  state3: library.state({
    name: "Ice Make: Basic",
    active: -1
  }),
  transform: {
    name: "Transform",
    active: 1,
    harmful: false,
    modify: function(payload, self) {
      let swap = payload.offense.skill[0];
      payload.offense.skill[0] = payload.offense.skill[4];
      payload.offense.skill[4] = swap;

      let swap2 = payload.offense.skill[1];
      payload.offense.skill[1] = payload.offense.skill[5];
      payload.offense.skill[5] = swap2;

      let swap3 = payload.offense.skill[2];
      payload.offense.skill[2] = payload.offense.skill[6];
      payload.offense.skill[6] = swap3;

      let check = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Unlimited"
      });
      if (check) {
        payload.offense.skill[0].target = "allenemy";
        payload.offense.skill[1].target = "allally";
        payload.offense.skill[2].target = "allenemy";
      }

      let check2 = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Geyser"
      });
      if (check2) {
        payload.offense.skill[0].val = "40";
        payload.offense.skill[2].val = "20";
      }

      let check3 = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Basic"
      });
      if (check3) {
        payload.offense.skill[0].energy.r -= 1;
        payload.offense.skill[1].energy.r -= 1;
        payload.offense.skill[2].energy.r -= 1;
      }
    }
  },
  transformBack: {
    name: "Transform",
    active: 1,
    harmful: false,
    modify: function(payload, self) {
      let swap = payload.offense.skill[0];
      payload.offense.skill[0] = payload.offense.skill[4];
      payload.offense.skill[4] = swap;

      let swap2 = payload.offense.skill[1];
      payload.offense.skill[1] = payload.offense.skill[5];
      payload.offense.skill[5] = swap2;

      let swap3 = payload.offense.skill[2];
      payload.offense.skill[2] = payload.offense.skill[6];
      payload.offense.skill[6] = swap3;

      let check = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Unlimited"
      });
      if (check) {
        payload.offense.skill[4].target = "enemy";
        payload.offense.skill[5].target = "ally";
        payload.offense.skill[6].target = "enemy";

        skill.removeStatus(
          {
            subject: payload.offense,
            onStatus: "onState",
            statusType: "state",
            name: "Ice Make: Unlimited"
          },
          "specific"
        );
      }

      let check2 = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Geyser"
      });
      if (check2) {
        payload.offense.skill[4].val = "20";
        payload.offense.skill[6].val = "10";

        skill.removeStatus(
          {
            subject: payload.offense,
            onStatus: "onState",
            statusType: "state",
            name: "Ice Make: Geyser"
          },
          "specific"
        );
      }

      let check3 = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Basic"
      });
      if (check3) {
        payload.offense.skill[4].energy.r += 1;
        payload.offense.skill[5].energy.r += 1;
        payload.offense.skill[6].energy.r += 1;

        skill.removeStatus(
          {
            subject: payload.offense,
            onStatus: "onState",
            statusType: "state",
            name: "Ice Make: Basic"
          },
          "specific"
        );
      }
    }
  }
};

let skills = {
  skill1: {
    name: "Ice Make: Unlimited",
    type: "attack",
    val: 0,
    cooldown: 3,
    alt: 4,
    harmful: false,
    classes: ["instant", "strategic"],
    energy: {
      s: 1
    },
    description:
      "Gray replaces his skills with their alternatives that will also target a whole team.",
    target: "self",
    move: function(payload, self) {
      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onState",
        status: status.state,
        inherit: this
      });

      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onSelf",
        status: status.transform,
        inherit: this
      });
    }
  },
  skill2: {
    name: "Ice Make: Geyser",
    type: "attack",
    val: 0,
    alt: 5,
    cooldown: 3,
    harmful: false,
    classes: ["instant", "strategic"],
    energy: {
      r: 1
    },
    description:
      "Gray replaces his skills with their alternatives that will also activate twice.",
    target: "self",
    move: function(payload, self) {
      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onState",
        status: status.state,
        inherit: this
      });

      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onSelf",
        status: status.transform,
        inherit: this
      });
    }
  },
  skill3: {
    name: "Ice Make: Basic",
    type: "attack",
    val: 0,
    alt: 6,
    cooldown: 2,
    harmful: false,
    classes: ["instant", "strategic"],
    energy: {},
    description:
      "Gray replaces his skills with their alternatives that will also cost one less random energy.",
    target: "self",
    move: function(payload, self) {
      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onState",
        status: status.state,
        inherit: this
      });

      skill.pushStatus({
        subject: payload.offense,
        onStatus: "onSelf",
        status: status.transform,
        inherit: this
      });
    }
  },
  skill4: {
    name: "Ice Make: Clone",
    type: "invulnerable",
    harmful: false,
    val: 0,
    cooldown: 4,
    description:
      "This skill Makes Gray Fullbuster invulnerable for one turn. This skill stacks.",
    target: "self",
    classes: ["instant", "strategic"],
    energy: {
      r: 1
    },
    move: function(payload, self) {
      payload.offense.skill[3].usage += 1;
      let usage = payload.offense.skill[3].usage;
      let invulnerable = status.invulnerable;
      invulnerable.active = usage + 1;

      skill.pushStatus({
        subject: payload.target,
        onStatus: "onState",
        status: invulnerable,
        inherit: this
      });
    }
  },
  skill5: {
    name: "Ice Make: Lance",
    type: "attack",
    piercing: true,
    val: 20,
    alt: 0,
    cooldown: 0,
    description:
      "Gray deals 20 piercing damage to one enemy. Afterwards, his skills revert to their originals.",
    classes: ["instant", "ranged", "energy"],
    energy: {
      r: 1
    },
    target: "enemy",
    move: function(payload, self) {
      skill.damage({
        subject: payload.target,
        val: payload.val
      });

      if (payload.recursive === 0) {
        skill.pushStatus({
          subject: payload.offense,
          onStatus: "onSelf",
          status: status.transformBack,
          inherit: this
        });
      }
    }
  },
  skill6: {
    name: "Ice Make: Shield",
    type: "protect",
    val: 0,
    alt: 1,
    harmful: false,
    cooldown: 3,
    description:
      "Gray grants one ally 25 destructible defense. While this defense is active, they will ignore all harmful non-damage effects. Afterwards, his skills revert to their originals.",
    classes: ["instant", "strategic"],
    energy: {
      r: 2
    },
    target: "ally",
    move: function(payload, self) {
      let check = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Geyser"
      });

      skill.pushStatus({
        subject: payload.target,
        onStatus: "onState",
        status: status.ignore,
        inherit: this
      });

      if (check) {
        skill.pushStatus(
          {
            subject: payload.target,
            onStatus: "onReceive",
            status: status.dd2,
            inherit: this
          },
          "stackDD"
        );
      } else {
        skill.pushStatus(
          {
            subject: payload.target,
            onStatus: "onReceive",
            status: status.dd,
            inherit: this
          },
          "stackDD"
        );
      }

      if (payload.recursive === 0) {
        skill.pushStatus({
          subject: payload.offense,
          onStatus: "onSelf",
          status: status.transformBack,
          inherit: this
        });
      }
    }
  },
  skill7: {
    name: "Ice Make: Hammer",
    type: "attack",
    val: 10,
    alt: 2,
    cooldown: 3,
    description:
      "Gray deals 10 damage to one enemy and stuns a random enemy for 1 turn. This skill cannot affect the same enemy twice. Afterwards, his skills revert to their originals.",
    classes: ["instant", "ranged", "energy"],
    energy: {
      s: 1,
      r: 1
    },
    target: "enemy",
    move: function(payload, self) {
      skill.damage({
        subject: payload.target,
        val: payload.val
      });

      //Attack random
      let random = payload.state[payload.theirTurn].filter(
        x =>
          x.hp > 0 &&
          !x.status.onState.some(
            s => s.type === "stun" && s.name === "Ice Make: Hammer"
          ) &&
          !x.status.onState.some(s => s.type === "invulnerable")
      );
      if (random.length > 0) {
        let chooseRandom = helper.getRandomInt(random.length);
        skill.pushStatus({
          subject: random[chooseRandom],
          onStatus: "onState",
          status: status.stun,
          inherit: this
        });
      }

      let check = skill.checkStatus({
        subject: payload.offense,
        onStatus: "onState",
        statusType: "state",
        statusName: "Ice Make: Geyser"
      });
      if (check) {
        let random2 = payload.state[payload.theirTurn].filter(
          x =>
            x.hp > 0 &&
            !x.status.onState.some(
              s => s.type === "stun" && s.name === "Ice Make: Hammer"
            ) &&
            !x.status.onState.some(s => s.type === "invulnerable")
        );
        if (random2.length > 0) {
          let chooseRandom2 = helper.getRandomInt(random2.length);
          skill.pushStatus({
            subject: random2[chooseRandom2],
            onStatus: "onState",
            status: status.stun,
            inherit: this
          });
        }
      }

      if (payload.recursive === 0) {
        skill.pushStatus({
          subject: payload.offense,
          onStatus: "onSelf",
          status: status.transformBack,
          inherit: this
        });
      }
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
    skills.skill5,
    skills.skill6,
    skills.skill7
  ]
};

module.exports = character;
