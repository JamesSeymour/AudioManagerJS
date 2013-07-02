AudioManagerJS = function() 
{
	this.webAudioContext = new webkitAudioContext();
};

AudioManagerJS.prototype.loadNotes = function(selectedSoundBank, fLoadingComplete)
{	
	noteBuffers = {};
	var noteBuffersArray = [];

	for(note in selectedSoundBank)
	{
		this.webAudioContext.decodeAudioData(Base64Binary.decodeArrayBuffer(selectedSoundBank[note].split(",")[1]), function(buffer) 
		{
	    	noteBuffersArray.push(buffer);
	    }, function() 
	    {
	    	throw "AudioManagerJS: Sound file failed to load.";
	    });
	}

	var loadingInterval = setInterval(function() 
	{
		if(noteBuffersArray.length === Object.keys(selectedSoundBank).length)
		{
			clearInterval(loadingInterval);

			var count = 0;
			for(note in selectedSoundBank)
			{
				noteBuffers[note] = noteBuffersArray[count];
				count++;
			}
			delete noteBuffersArray;
			fLoadingComplete();
		}
	}, 10);
};

AudioManagerJS.prototype._playBuffer = function(buffer)
{
	var source = this.webAudioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(this.webAudioContext.destination);
	source.noteOn(0);  
};

AudioManagerJS.prototype.playNote = function(note)
{
	this._playBuffer(noteBuffers[note]);
};
