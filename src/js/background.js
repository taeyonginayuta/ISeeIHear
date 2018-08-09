// background.js
// connect to popup.js

console.log('background script running');

function setData(data) {
	chrome.storage.local.set(data, function() {
		console.log(data);
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

// var toggle = false, status = 'off', tab_id = '', tab_url = '';

// function toggleStatus() {
// 	toggle = !toggle;
// 	status = 'off';
// 	if(toggle) { status = 'on'; }
// 	alert('toggle status: ' + status);
// }

// function toggleExtension(tab){
// 	chrome.tabs.executeScript({ code: 'var extension_status = "'+status+'"' });
// 	// chrome.tabs.executeScript({ file: 'src/js/gaze-controls.css' });
// 	chrome.tabs.executeScript({ file: 'src/js/gaze-controls.js' });
// 	tab_id = tab.id;
// 	tab_url = tab.url;
// 	// console.log(tab_url)
// 	alert('toggle extension - execute script');
// }

// function reloadContent(tabId, changeInfo, tab) {
//     if (changeInfo.status=='complete' || tabId==tab_id && status=='on') {
//         toggleExtension(tab);
//     }
// }

// chrome.tabs.onCreated.addListener(function(tab) {
//     toggleStatus();
//     // toggleExtension(tab);
//     alert('onCreated');
// });

chrome.tabs.onUpdated.addListener(maintainScript);

var curr_tab_id = 0, curr_window_id = 0;


function maintainScript(tabId, changeInfo, tab) {
	console.log('tab updated');

		curr_tab_id = tab.id;
		curr_window_id = tab.windowId;

		getData(function (data) {
			var mode = data['mode'];
			var active_tab_id = data['active_tab_id'];
			var active_window_id = data ['active_window_id'];

			if((curr_tab_id == active_tab_id) || (curr_window_id == active_window_id)) {
				if(mode=='GAZE' && data['gaze_mode']) connectGaze();
				else if(mode=='VOICE' && data['voice_mode']) connectVoice();
				else if(mode=='BOTH' && data['both_mode']) connectBoth();
				else if(mode=='OFF') console.log('Modes are turned off.');
				else console.log('Error!');
			}
			else{
				alert();
			}

			console.log('Active Tab ID: ' + active_tab_id);
			console.log('Active Window ID: ' + active_window_id);
			console.log('Current Tab ID: ' + curr_tab_id);
			console.log('Current Window ID: ' + curr_window_id);

			console.log(tab);
			
		});
}

function connectGaze() {
	var data = {
		'gaze_mode' : true,
		'voice_mode' : false,
		'both_mode' : false
	};
	console.log('connectGaze');
	setData(data);
	chrome.tabs.executeScript({file: 'src/js/gaze-controls.js'});
	// chrome.tabs.executeScript({file: ''});   // script that will disable voice-controls
}

function connectVoice() {
	var data = {
		'gaze_mode' : false,
		'voice_mode' : true,
		'both_mode' : false
	};
	console.log('connectVoice');
	setData(data);
	// chrome.tabs.executeScript({file: ''});   // script that will disable gaze-controls
	// chrome.tabs.executeScript({file: ''});   // script that will enable voice-controls
}

function connectBoth() {
	var data = {
		'gaze_mode' : false,
		'voice_mode' : false,
		'both_mode' : true
	};
	console.log('connectBoth');
	setData(data);
	// chrome.tabs.executeScript({file: ''});   // script that will enable gaze-controls
	// chrome.tabs.executeScript({file: ''});   // script that will enable voice-controls
}

