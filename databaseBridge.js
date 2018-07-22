'use strict'

// const config = require('./config')
// const db = require('./db')
// const GistClient = require('gist-client')
// const gist = new GistClient()

import * as config from './config'
import * as db from './db'
import * as GistClient from 'gist-client'
const gist = new GistClient()

const models = db.models

;(async function () {
  const databaseData = {}

  for (var model in models) {
    databaseData[model] = []
    const results = await db.models[model].findAll()
    const data = results.map(function (el) {
      return el.dataValues
    })
    databaseData[model] = data
  }

  const stringifiedDatabaseData = JSON.stringify(databaseData)
  gist
    .setToken(config.githubToken)
    .update(config.gistId, {
      files: {
        'database.json': {
          content: stringifiedDatabaseData
        }
      }
    })
    .then(response => {
      console.log(`updated db @ ${response.html_url}`)
    })
    .catch(err => { throw new Error(err) })
})()
