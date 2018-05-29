/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('mfpjsloaded', this.mfpLoaded.bind(this), false);
    },
    // mfp loaded event handler
    mfpLoaded: function() {
        let chatViewElement = document.getElementById('chatView');
        chatViewElement.setAttribute('style','display:block;');  
        let button = document.getElementById('send');
        button.addEventListener('click', this.sendUserText, false);
    },
    sendUserText: function() {
       let userTextElement = document.getElementById('userText');
       let text = userTextElement.value;
       userTextElement.value = '';
       if (text === '')
          return;
       let userChatDiv = document.createElement('div');
       userChatDiv.setAttribute('class', 'chat-container');

       let userText = document.createElement('P');
       userText.setAttribute('class', 'chatText');
       let textNode = document.createTextNode(text);
       userText.appendChild(textNode);
       userChatDiv.appendChild(userText);
       let chatViewElement = document.getElementById('chatView');
       chatViewElement.appendChild(userChatDiv); 
       // Replace YOUR_WORKSPACE_ID with the workspace id
       let url = '/adapters/WatsonConversation/v1/workspaces/YOUR_WORKSPACE_ID/message';
       let resourceRequest = new WLResourceRequest(url, WLResourceRequest.POST);
       let versionString = "2017-05-26";
       let payload = {};
       payload.input = {"text":text};  
       payload.context = {"conversation_id": "1b7b67c0-90ed-45dc-8508-9488bc483d5b", "system": {"dialog_stack": [{"dialog_node": "root"}],"dialog_turn_counter": 1, "dialog_request_counter": 1}};
       payload.alternateIntents = "true";
       resourceRequest.setQueryParameter("version",versionString);
       let options = {
           onSuccess(data) {
             let responseText = JSON.parse(data.responseText);
             let text = responseText.output.text;
             let watsonChatDiv = document.createElement('div');
             watsonChatDiv.setAttribute('class', 'watson-container');

             let watsonText = document.createElement('p');
             watsonText.setAttribute('class', 'watsonText');
             let watsonTextNode = document.createTextNode(text);
             watsonText.appendChild(watsonTextNode);
             watsonChatDiv.appendChild(watsonText);
             chatViewElement.appendChild(watsonChatDiv);
           },
           onFailure(error) {
             alert(JSON.stringify(error));
           }
       };
       resourceRequest.send(payload).then(options.onSuccess, options.onFailure);
    }
};

app.initialize();
