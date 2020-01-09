
'use strict';

const functions = require('firebase-functions');

const moment = require('moment');
const cors = require('cors')({
  origin: true,
});

exports.users = functions.https.onRequest((req: any, res: any) => {

  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }

  // TODO:
  // - Get requesting user data -> especially roles, company, chat, participants and permissions
  // - Implement rules:
  // If allowed to access public data: Return basic user data and anonymous data
  // If allowed to access secure data: Return all user data
  return cors(req, res, () => {

    const data = {
        name: "test",
        email: "test"
    };

    console.log('Sending user data:', data);
    res.status(200).send(data);
  });
});
