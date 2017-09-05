/* global expect, test */
import { keaReducer } from 'kea'
import PropTypes from 'prop-types'

test('homepage logic has all the right properties', () => {
  keaReducer('scenes')

  const logic = require('./logic').default

  expect(logic.path).toEqual(['scenes', 'homepage', 'index'])

  // actions
  expect(Object.keys(logic.actions)).toEqual(['updateName'])

  const { updateName } = logic.actions

  expect(typeof updateName).toBe('function')
  expect(updateName.toString()).toBe('update name (homepage.index)')
  expect(updateName('newname')).toEqual({ payload: { name: 'newname' }, type: updateName.toString() })

  // reducers
  const defaultValues = { name: 'Chirpy' }
  const state = { scenes: { homepage: { index: defaultValues } } }
  expect(Object.keys(logic.reducers).sort()).toEqual(['capitalizedName', 'name'])

  expect(logic.reducers).toHaveProperty('name.reducer')
  expect(logic.reducers).toHaveProperty('name.type', PropTypes.string)
  expect(logic.reducers).toHaveProperty('name.value', 'Chirpy')

  const nameReducer = logic.reducers.name.reducer
  expect(Object.keys(nameReducer)).toEqual([ updateName.toString() ])
  expect(nameReducer[updateName.toString()]).toBeDefined()
  expect(nameReducer[updateName.toString()]('', { name: 'newName' })).toBe('newName')

  expect(logic.reducers).not.toHaveProperty('capitalizedName.reducer')
  expect(logic.reducers).toHaveProperty('capitalizedName.type', PropTypes.string)
  expect(logic.reducers).not.toHaveProperty('capitalizedName.value', 'chirpy')

  // big reducer
  expect(typeof logic.reducer).toBe('function')
  expect(logic.reducer({}, { type: 'random action' })).toEqual(defaultValues)
  expect(logic.reducer({ name: 'something' }, { type: 'random action' })).toEqual({ name: 'something' })
  expect(logic.reducer({ name: 'something' }, updateName('newName'))).toEqual({ name: 'newName' })

  // selectors
  expect(Object.keys(logic.selectors).sort()).toEqual(['capitalizedName', 'name', 'root'])
  expect(logic.selectors.name(state)).toEqual('Chirpy')
  expect(logic.selectors.capitalizedName(state)).toEqual('Chirpy')

  // root selector
  expect(logic.selector(state)).toEqual(defaultValues)
  expect(logic.selectors.root(state)).toEqual(defaultValues)
})
