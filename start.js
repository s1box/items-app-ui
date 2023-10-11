/*
(c) 2023 Mykola Morhun
Demo NodeJS backended UI using bootstrap.

This program is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation,
either version 2 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.
*/

const app = require('./app')

if (!process.env.HOSTNAME) {
  process.env.HOSTNAME = '0.0.0.0'
}
if (!process.env.PORT) {
  process.env.PORT = 3000
}

ensureEnvironmentConfigured()

const server = app.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log(`UI is running on ${server.address().address}:${server.address().port}`)
});

process.on('SIGTERM', () => {
  console.log('Got SIGTERM signal, shutting down the server')
  server.close(() => {
    console.log('Server stopped')
  })
})

function ensureEnvironmentConfigured() {
  stopWithMissingEnvVar = function(envVarName) {
    console.log('Environment variable ' + envVarName + ' is not set.')
    process.exit(1)
  }

  if (!process.env.HOSTNAME) {
    stopWithMissingEnvVar('HOSTNAME')
  }
  if (!process.env.PORT) {
    stopWithMissingEnvVar('PORT')
  }

  if (!process.env.ITEMS_SERVICE_HOSTNAME) {
    stopWithMissingEnvVar('ITEMS_SERVICE_HOSTNAME')
  }
  if (!process.env.ITEMS_SERVICE_PORT) {
    stopWithMissingEnvVar('ITEMS_SERVICE_PORT')
  }

  if (!process.env.ITEMS_RATING_SERVICE_HOSTNAME) {
    stopWithMissingEnvVar('ITEMS_RATING_SERVICE_HOSTNAME')
  }
  if (!process.env.ITEMS_RATING_SERVICE_PORT) {
    stopWithMissingEnvVar('ITEMS_RATING_SERVICE_PORT')
  }
}
