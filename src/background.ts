// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// A generic onclick callback function.
chrome.contextMenus.onClicked.addListener(genericOnClick)

// A generic onclick callback function.
function genericOnClick(info) {
    if (info.menuItemId === 'bustIt') {
        console.log('Bust it!')
    }
}
chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: 'Bust it!',
        contexts: ['video'],
        id: 'bustIt',
    })
    // Create one test item for each context type.
    // let contexts = [
    //     'page',
    //     'selection',
    //     'link',
    //     'editable',
    //     'image',
    //     'video',
    //     'audio'
    // ];
    // for (let i = 0; i < contexts.length; i++) {
    //     let context = contexts[i];
    //     let title = "Test '" + context + "' menu item";
    //     chrome.contextMenus.create({
    //         title: title,
    //         contexts: [context],
    //         id: context
    //     });
    // }
    //
    // // Create a parent item and two children.
    // let parent = chrome.contextMenus.create({
    //     title: 'Test parent item',
    //     id: 'parent'
    // });
    // chrome.contextMenus.create({
    //     title: 'Child 1',
    //     parentId: parent,
    //     id: 'child1'
    // });
    // chrome.contextMenus.create({
    //     title: 'Child 2',
    //     parentId: parent,
    //     id: 'child2'
    // });
    //
    // // Create a radio item.
    // chrome.contextMenus.create({
    //     title: 'radio',
    //     type: 'radio',
    //     id: 'radio'
    // });
    //
    // // Create a checkbox item.
    // chrome.contextMenus.create({
    //     title: 'checkbox',
    //     type: 'checkbox',
    //     id: 'checkbox'
    // });
})
