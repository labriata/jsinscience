function analyzeabstracts(whattodo,wheretoput)
{    
  var whattosearch=""
  if (wheretoput == "abstractsbyauthor") {whattosearch = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=100&term=\"abriata+la\"+[Author]) \"last 12 months\"[EPDAT]'}
  if (wheretoput == "abstractsbyprotein") {whattosearch = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=100&term="javascript" \"last 2 months\"[EPDAT]'}

  $.ajax({
    type: 'GET',
	url: whattosearch,
	dataType: 'json'
  }).done(function (data)
  {
    if (data.esearchresult.count > 0)
    {
      if (whattodo == "listitems") {
        var content = data.esearchresult.count + " matches in Pubmed, <a href='https://www.ncbi.nlm.nih.gov/pubmed/?term=" + "COA6" + "' target='blank'>click here to open</a>";
        var ids = data.esearchresult.idlist;
        var publications = [];
        iterateJSON(ids, publications, wheretoput);
      }
    }
  })
}

function iterateJSON(idlist, publications, wheretoput) {
    var id = idlist.pop();
    $.getJSON('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id='+id+'&retmode=json', function(summary){
        var citation = "<p>";
        
        for(author in summary.result[id].authors){
            citation+=summary.result[id].authors[author].name+', ';
        }
        citation+=' <b>'+summary.result[id].title+' <i>'+summary.result[id].fulljournalname+'</i></b> ' + summary.result[id].pubdate + '   [<a href=\"https://www.ncbi.nlm.nih.gov/pubmed/' + id + '\" target=\"_blank\">See in PubMed</a>] -'  + ' [<a href=\"#\" onclick=\"analyzeabstract(' + id + ',\'' + summary.result[id].title.toLowerCase() + '\')\">Analyze abstract</a>]<p>';

        publications.push(citation);
        
        if(idlist.length!=0){
        	$("#"+wheretoput).append(citation)
            iterateJSON(idlist, publications, wheretoput);
        }else{
            $("#"+wheretoput).append("<p>DONE")
        }                
    });
}

function analyzeabstract(id,title){
  $.get("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=text&rettype=abstract&id=" + id, function(abstracttext){
    lines = abstracttext.toLowerCase().split("\n")
    var passedAuthorInformation=0
    var reachedEnd=0
    var abstracttext=""
    for (i=0; i<lines.length; i++) {
      if (lines[i].substring(0,19) === "author information:") {
        while (lines[i] != "") {i++}
        passedAuthorInformation=i
      }
      if (lines[i].substring(0,2) === "© " || lines[i].substring(0,4) === "pmid" || lines[i].substring(0,3) === "doi" || lines[i].substring(0,5) === "pmcid") {
        reachedEnd=i
      }
      if (passedAuthorInformation > 0 && reachedEnd == 0) {
        abstracttext = abstracttext + " " + lines[i]
      }
    }
	var t = window.nlp(abstracttext.removeStopWords())
    
    var trigrams = t.ngrams().trigrams(0).sort('freq').unique().data()
    var txt=""
    var nntrigrams=0
    for (i=0; i<trigrams.length; i++) {
      if (trigrams[i].count > 1 && nntrigrams<10 && title.indexOf(trigrams[i].normal) == -1) {
    	txt = txt + " " + trigrams[i].normal + "\n" //"  (" + trigrams[i].count + ")\n"
        nntrigrams++;
      }
    }
    var bigrams = t.ngrams().bigrams(0).sort('freq').unique().data()
    var nnbigrams=0
    for (i=0; i<bigrams.length; i++) {
      if (bigrams[i].count > 1 && nnbigrams<10 && title.indexOf(bigrams[i].normal) == -1) {
        var alreadyincluded=0
        for (j=0;j<nntrigrams;j++) {
          if (trigrams[j].normal.includes(bigrams[i].normal) > 0) { alreadyincluded=1; }
        }
        if (alreadyincluded == 0) { txt = txt + " " + bigrams[i].normal + "\n" } // "  (" + bigrams[i].count + ")\n" }      if (bigrams[i].count > 1 && nn < 10 && title.indexOf(bigrams[i].normal) == -1) {
        nnbigrams++;
      }
    }
    var monograms = t.ngrams().unigrams(0).sort('freq').unique().data()
    var nnmonograms=0
    for (i=0; i<monograms.length; i++) {
      if (monograms[i].count > 1 && nnmonograms<10 && title.indexOf(monograms[i].normal) == -1) {
	  var alreadyincluded=0
        for (j=0;j<nntrigrams.length;j++) {
          if (trigrams[j].normal.includes(monograms[i].normal) > 0) { alreadyincluded=1; }
        }
        for (j=0;j<nnbigrams;j++) {
          if (bigrams[j].normal.includes(monograms[i].normal) > 0) { alreadyincluded=1; }
        }
        if (alreadyincluded == 0) { txt = txt + " " + monograms[i].normal + "\n" } // "  (" + monograms[i].count + ")\n" }
        nnmonograms++;
      }
    }
    alert(txt)
  });
}


/*
 * String method to remove stop words
 * Written by GeekLad http://geeklad.com
 * Stop words obtained from http://www.lextek.com/manuals/onix/stopwords1.html
 *   Usage: string_variable.removeStopWords();
 *   Output: The original String with stop words removed
 */
//FROM http://geeklad.com/remove-stop-words-in-javascript
String.prototype.removeStopWords = function() {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = this.valueOf();
    var stop_words = new Array(
        'a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'i',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'like',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'point',
        'pointed',
        'pointing',
        'points',
        'possible',
        'present',
        'presented',
        'presenting',
        'presents',
        'problem',
        'problems',
        'put',
        'puts',
        'q',
        'quite',
        'r',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'small',
        'smaller',
        'smallest',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'thought',
        'thoughts',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'u',
        'under',
        'until',
        'up',
        'upon',
        'us',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'working',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yet',
        'you',
        'young',
        'younger',
        'youngest',
        'your',
        'yours',
        'z'
    )
         
    // Split out all the individual words in the phrase
    words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)
 
    // Review all the words
    for(x=0; x < words.length; x++) {
        // For each word, check all the stop words
        for(y=0; y < stop_words.length; y++) {
            // Get the current word
            word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
             
            // Get the stop word
            stop_word = stop_words[y];
             
            // If the word matches the stop word, remove it from the keywords
            if(word.toLowerCase() == stop_word) {
                // Build the regex
                regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
                regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
                regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
                regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
                regex = new RegExp(regex_str, "ig");
             
                // Remove the word from the keywords
                cleansed_string = cleansed_string.replace(regex, " ");
            }
        }
    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
}