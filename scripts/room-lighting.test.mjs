import assert from 'node:assert/strict'
import test from 'node:test'
import { getNextRoomTheme, getRoomLighting } from '../src/lib/roomLighting.ts'

for (const [time, expected] of [
  ['00:00:00', 'night'],
  ['05:59:59.999', 'night'],
  ['06:00:00', 'day'],
  ['15:59:59.999', 'day'],
  ['16:00:00', 'sunset'],
  ['17:59:59.999', 'sunset'],
  ['18:00:00', 'night'],
  ['23:59:59.999', 'night'],
]) {
  test(`${time} PHT selects ${expected}`, () => {
    assert.equal(getRoomLighting(new Date(`2026-11-17T${time}+08:00`)).theme, expected)
  })
}

test('the clock and lighting use Manila time for the same UTC instant', () => {
  const lighting = getRoomLighting(new Date('2026-11-17T08:52:00Z'))
  assert.equal(lighting.theme, 'sunset')
  assert.equal(lighting.time, '04:52 PM')
})

test('the previous UTC date already uses the next Manila morning', () => {
  const lighting = getRoomLighting(new Date('2026-11-16T22:00:00Z'))
  assert.equal(lighting.theme, 'day')
  assert.equal(lighting.time, '06:00 AM')
})

test('direct clicks cycle through morning, sunset and night', () => {
  assert.equal(getNextRoomTheme('day'), 'sunset')
  assert.equal(getNextRoomTheme('sunset'), 'night')
  assert.equal(getNextRoomTheme('night'), 'day')
})
