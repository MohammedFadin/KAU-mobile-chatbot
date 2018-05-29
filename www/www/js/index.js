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
        //document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('mfpjsloaded', this.mfpLoaded.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //this.receivedEvent('deviceready');
    },
    mfpLoaded: function() {
        var chatViewElement = document.getElementById('chatView');
        chatViewElement.setAttribute('style','display:block;');  
        var button = document.getElementById('send');
        button.addEventListener('click', this.sendUserText, false);
        //showChatView('chatView');
    },
    showChatView: function(id) {
       var chatViewElement = document.getElementById(id);
       chatViewElement.setAttribute('style','display:block;');  
       chatViewElement.addEventListener('click', this.sendUserText);
    },
    inputFocus: function() {
       console.log('inputFocus');
       alert('inputFocus');
       let viewHeight = document.getElementById('chatView').offsetHeight;
       window.scrollTo(0,viewHeight);
    },
    sendUserText: function() {
       var userTextElement = document.getElementById('userText');
       var text = userTextElement.value;
       userTextElement.value = '';
       if (text === '')
          return;
       var userChatDiv = document.createElement('div');
       userChatDiv.setAttribute('class', 'chat-container');

       var userText = document.createElement('P');
       userText.setAttribute('class', 'chatText');
       var textNode = document.createTextNode(text);
       userText.appendChild(textNode);
       userChatDiv.appendChild(userText);
       var chatViewElement = document.getElementById('chatView');
       chatViewElement.appendChild(userChatDiv); 
       let url = '/adapters/WatsonConversation/v1/workspaces/3dbefb15-fab9-4958-a4d8-67e2648ad35f/message';
       let resourceRequest = new WLResourceRequest(url, WLResourceRequest.POST);
       let versionString = "2017-05-26";
       let payload = {};
       payload.input = {"text":text};  
       payload.context = {"conversation_id": "1b7b67c0-90ed-45dc-8508-9488bc483d5b", "system": {"dialog_stack": [{"dialog_node": "root"}],"dialog_turn_counter": 1, "dialog_request_counter": 1}};
       payload.alternateIntents = "true";
       resourceRequest.setQueryParameter("version",versionString);
       let options = {
           onSuccess(data) {
             var responseText = JSON.parse(data.responseText);
             var text = responseText.output.text;
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
	     alert('error');
           }
       };
       resourceRequest.send(payload).then(options.onSuccess, options.onFailure);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }
};

app.initialize();
