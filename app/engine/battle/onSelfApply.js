const _ = require("lodash");
const management = require("./management.js");

function team(ownerid, state) {
  let index = state.teamOdd.findIndex(x => x.nameId === ownerid);
  if (index > -1) {
    return state.teamOdd[index];
  } else {
    return state.teamEven[state.teamEven.findIndex(x => x.nameId === ownerid)];
  }
}

function persistenceCheck(skill, owner, state, context) {
  let caster = owner;
  //   let caster = team(casterid, state);
  let evaluate;
  if (context === "attacker") {
    let onState = caster.status.onState;
    let stun = management.stun(onState, skill);
    console.log("persistence check", stun);
    evaluate = stun;
  } else if (context === "receiver") {
    let onState = caster.status.onState;
    let invulnerable = management.invulnerable(onState, skill);
    evaluate = invulnerable;
    // evaluate = caster.status.onState.some(x => x.type === "invulnerable");
  }
  if (
    evaluate === true &&
    (skill.persistence === "action" || skill.persistence === "control")
  ) {
    return true;
  } else {
    return false;
  }
}

function selfApply(package) {
  let s = package.skillStore;
  let nameId = package.target.nameId;
  let state = package.stateCopy;

  if (s.period === "instant") {
    let attacker = persistenceCheck(s, package.offense, state, "attacker");
    let receiver = persistenceCheck(s, package.target, state, "receiver");
    if (attacker === false && receiver === false) {      
      s.modify({
        offense: package.target,
        val: package.val,
        active: s.active,
        myEnergy: package.myEnergy,
        theirEnergy: package.theirEnergy
      });      
    }
    s.active -= 1;
  }
}

function receiveApply(package, callback) {
  let packageCopy = _.cloneDeep(package);
  package.target.status.onReceive.forEach(x => x.modify(packageCopy));  
  package.val = packageCopy.val;  
  callback(package);
}

function postApply(payload) {
  let state = payload.store;
  let offense = team(payload.offense, state);
  let target = team(payload.target, state);

  let package = {
    offense: offense,
    target: target,
    val: payload.skill.val,
    skillStore: payload.skill,
    myEnergy: payload.myEnergy,
    theirEnergy: payload.theirEnergy,
    myTurn: payload.myTurn,
    store: payload.store,
    stateCopy: payload.stateCopy
  };

  if (package.target.status.onReceive.length > 0) {
    receiveApply(package, x => {
      selfApply(x);
    });
  } else {
    selfApply(package);
  }
}

module.exports = postApply;