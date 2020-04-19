export function dbGroup(req, res, next) {
  req.dbGroup = req.get('x-groups')
    .split(',')
    .map(elem => elem.trim())
    .find(elem => elem.startsWith('db:')).substr(3);
  next();
}

export function putMessage(options) {
  return async function(req, res) {
    try {
      await options.repo.putMessage(req.dbGroup, req.body);
      res.sendStatus(200);
    } catch(error) {
      res.status(500).json(error);
    }
  };
};

export function getMeasurementDataByStartEndTime(options) {
  return async function(req, res) {
    try {
      let data = await options.repo.getMeasurementDataByStartEndTime(req.dbGroup, new Date(req.query.startTime), new Date(req.query.endTime));
      res.json({result: data});
    } catch(error) {
      res.status(500).json(error);
    }
  };
}

export function getAllEquipment(options) {
  return async function(req, res) {
    try {
      let data = await options.repo.getAllEquipment(req.dbGroup);
      res.json({result: data});
    } catch(error) {
      res.status(500).json(error);
    }
  };
}

export function getAllSensors(options) {
  return async function(req, res) {
    try {
      let data = await options.repo.getAllSensors(req.dbGroup);
      res.json({result: data});
    } catch(error) {
      res.status(500).json(error);
    }
  };
}

export function getAllParameterTypes(options) {
  return async function(req, res) {
    try {
      let data = await options.repo.getAllParameterTypes(req.dbGroup);
      res.json({result: data});
    } catch(error) {
      res.status(500).json(error);
    }
  };
}
