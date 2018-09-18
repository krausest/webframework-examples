import {IComboBoxValue, IProfileData} from './types';

export const LIST_SHOW = 'LIST_SHOW';
export const LIST_ITEM_DETAIL = 'LIST_ITEM_DETAIL';
export const LIST_ITEM_EDIT = 'LIST_ITEM_EDIT';
export const LIST_ITEM_SAVE = 'LIST_ITEM_SAVE';

export const PROFILE_SHOW = 'PROFILE_SHOW';
export const PROFILE_SAVE = 'PROFILE_SAVE';

export const COMPLEX_SHOW = 'COMPLEX_SHOW';

export const FLASH_MESSAGE_SET = 'FLASH_MESSAGE_SET';

export function listShow() {
    return {
        type: LIST_SHOW,
    }
}
export function listItemDetail(value: string) {
    return {
        type: LIST_ITEM_DETAIL,
        value
    }
}
export function listItemEdit(value: string) {
    return {
        type: LIST_ITEM_EDIT,
        value,
    }
}
export function listItemSave(item: IComboBoxValue) {
    return {
        type: LIST_ITEM_SAVE,
        item,
    }
}

export function profileShow() {
    return {
        type: PROFILE_SHOW,
    }
}
export function profileSave(profile: IProfileData) {
    return {
        type: PROFILE_SAVE,
        profile
    }
}

export function complexShow() {
    return {
        type: COMPLEX_SHOW,
    }
}

export function flashMessageSet(message: string) {
    return {
        type: FLASH_MESSAGE_SET,
        message
    }
}
