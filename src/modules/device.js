// import { StorageManager } from '../util/storage'
// import {
//   GCOOKIE_NAME,
//   COOKIE_EXPIRY
// } from '../util/constants'

// export class DeviceManager {
//   #guid
//   #appID
//   #logger

//   constructor (appID, loggerInstance) {
//     this.#appID = appID
//     this.#logger = loggerInstance

//     this.#guid = this.getGUID()
//   }

//   getGUID () {
//     let guid = null
//     if (this.#guid != null) {
//       return this.#guid
//     }

//     const guidValue = StorageManager.read(GCOOKIE_NAME)
//     if (guidValue != null) {
//       try {
//         guid = JSON.parse(decodeURIComponent(guidValue))
//       } catch (e) {
//         this.#logger.debug(`Cannot parse Gcookie from localstorage - must be encoded  ${value}`)
//         // assumming guids are of size 32. supporting both formats.
//         // guid can have encodedURIComponent or be without it.
//         // 1.56e4078ed15749928c042479ec2b4d47 - breaks on JSON.parse(decodeURIComponent())
//         // 2.%2256e4078ed15749928c042479ec2b4d47%22
//         if (guidValue.length === 32) {
//           guid = guidValue
//           StorageManager.saveToLSorCookie(GCOOKIE_NAME, guidValue)
//         } else {
//           this.#logger.error(`Illegal guid ${guidValue}`)
//         }
//       }

//       // Persist to cookie storage if not present there.
//       if (wiz.isValueValid(guid)) {
//         wiz.createBroadCookie(GCOOKIE_NAME, guid, COOKIE_EXPIRY, domain)
//       }
//     }
//     if (guid == null) {
//       guid = StorageManager.readCookie(GCOOKIE_NAME)
//       if (guid != null && (guid.indexOf('%') === 0 ||
//           guid.indexOf('\'') === 0 || guid.indexOf('"') === 0)) {
//         guid = null
//       }
//       if (guid != null) {
//         StorageManager.saveToLSorCookie(GCOOKIE_NAME, guid)
//       }
//     }
//     return guid
//   }
// }
import { isValueValid } from '../util/datatypes'
import { StorageManager } from '../util/storage'
import { GCOOKIE_NAME, COOKIE_EXPIRY } from '../util/constants'

export default class DeviceManager {
  #logger
  gcookie

  constructor ({ logger }) {
    this.#logger = logger
    this.gcookie = this.getGuid()
  }

  getGuid () {
    let guid = null
    if (isValueValid(this.gcookie)) {
      return this.gcookie
    }
    if (StorageManager._isLocalStorageSupported()) {
      const value = StorageManager.read(GCOOKIE_NAME)
      if (isValueValid(value)) {
        try {
          guid = JSON.parse(decodeURIComponent(value))
        } catch (e) {
          this.#logger.debug('Cannot parse Gcookie from localstorage - must be encoded ' + value)
          // assumming guids are of size 32. supporting both formats.
          // guid can have encodedURIComponent or be without it.
          // 1.56e4078ed15749928c042479ec2b4d47 - breaks on JSON.parse(decodeURIComponent())
          // 2.%2256e4078ed15749928c042479ec2b4d47%22
          if (value.length === 32) {
            guid = value
            StorageManager.saveToLSorCookie(GCOOKIE_NAME, value)
          } else {
            this.#logger.error('Illegal guid ' + value)
          }
        }

        // Persist to cookie storage if not present there.
        if (isValueValid(guid)) {
          StorageManager.createBroadCookie(GCOOKIE_NAME, guid, COOKIE_EXPIRY, window.location.hostname)
        }
      }
    }

    if (!isValueValid(guid)) {
      guid = StorageManager.readCookie(GCOOKIE_NAME)
      if (isValueValid(guid) && (guid.indexOf('%') === 0 || guid.indexOf('\'') === 0 || guid.indexOf('"') === 0)) {
        guid = null
      }
      if (isValueValid(guid)) {
        StorageManager.saveToLSorCookie(GCOOKIE_NAME, guid)
      }
    }

    return guid
  }
}
