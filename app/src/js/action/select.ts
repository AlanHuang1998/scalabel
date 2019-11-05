import _ from 'lodash'
import { State } from '../functional/types'
import { changeLabelsProps, changeSelect, deleteLabels } from './common'
import { deleteTracks, terminateTracks } from './track'
import * as types from './types'

/**
 * Delete given label
 * @param {number} itemIndex
 * @param {number} labelId
 * @return {DeleteLabelAction}
 */
export function deleteSelectedLabels (state: State): types.DeleteLabelsAction {
  const select = state.user.select
  const itemIndices: number[] =
    Object.keys(select.labels).map((key) => Number(key))
  const labelIds: number[][] = []
  for (const index of itemIndices) {
    labelIds.push(select.labels[index])
  }
  return deleteLabels(itemIndices, labelIds)
}

/**
 * Delete tracks corresponding to selected labels
 */
export function deleteSelectedTracks (state: State): types.DeleteLabelsAction {
  const select = state.user.select
  const tracks = []
  for (const key of Object.keys(select.labels)) {
    const index = Number(key)
    for (const labelId of select.labels[index]) {
      const label = state.task.items[index].labels[labelId]
      if (label.track in state.task.tracks) {
        tracks.push(state.task.tracks[label.track])
      }
    }
  }
  return deleteTracks(tracks)
}

/**
 * Terminate tracks corresponding to selected labels
 */
export function terminateSelectedTracks (
  state: State,
  stopIndex: number
): types.DeleteLabelsAction {
  const select = state.user.select
  const tracks = []
  for (const key of Object.keys(select.labels)) {
    const index = Number(key)
    for (const labelId of select.labels[index]) {
      const label = state.task.items[index].labels[labelId]
      if (label.track in state.task.tracks) {
        tracks.push(state.task.tracks[label.track])
      }
    }
  }
  return terminateTracks(tracks, stopIndex)
}

/**
 * Change the properties of the label
 * @param {number} itemIndex
 * @param {number} labelId
 * @param {Partial<LabelType>}props
 * @return {ChangeLabelPropsAction}
 */
export function changeSelectedLabelsAttributes (
  state: State,
  attributes: {[key: number]: number[]}
  ): types.ChangeLabelsAction {
  const select = state.user.select
  const labelIds = Object.values(select.labels)
  const duplicatedAttributes = labelIds.map(((_id) => ({ attributes })))
  return changeLabelsProps([select.item], labelIds, [duplicatedAttributes])
}

/**
 * Change the properties of the label
 * @param {number} itemIndex
 * @param {number} labelId
 * @param {Partial<LabelType>}props
 * @return {ChangeLabelPropsAction}
 */
export function changeSelectedLabelsCategories (
  state: State,
  category: number[]
  ): types.ChangeLabelsAction {
  const select = state.user.select
  const labelIds = Object.values(select.labels)
  const duplicatedCategories = labelIds.map(((_id) => ({ category })))
  return changeLabelsProps([select.item], labelIds, [duplicatedCategories])
}

/**
 * Select label by ID
 * @param {number} labelId
 */
export function selectLabel (
  state: State,
  itemIndex: number,
  labelId: number,
  category?: number,
  attributes?: {[key: number]: number[]},
  append: boolean = false
): types.ChangeSelectAction {
  const selectedLabels = _.cloneDeep(state.user.select.labels)
  const labelIds = (append && itemIndex in selectedLabels) ?
    selectedLabels[itemIndex] : []
  if (labelId >= 0 && !labelIds.includes(labelId)) {
    labelIds.push(labelId)
  } else if (labelId >= 0 && labelIds.includes(labelId)) {
    for (let i = 0; i < labelIds.length; i++) {
      if (labelIds[i] === labelId) {
        labelIds.splice(i, 1)
        break
      }
    }
  }
  if (labelIds.length > 0 && itemIndex >= 0) {
    selectedLabels[itemIndex] = labelIds
  } else {
    delete selectedLabels[itemIndex]
  }
  return changeSelect({ labels: selectedLabels, category, attributes })
}
