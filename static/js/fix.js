const fs = require('fs');
const filepath = 'index.html';
const lines = fs.readFileSync(filepath, 'utf8').split('\n');

const newHTML = `          <h2 class="section-title">A Land of <em>Tradition & Peace</em></h2>
          
          <div class="about-text-content">
            <p class="about-description tamil-text">
              பனங்காடு (Panangadu) என்பது வேலூர் மாவட்டம் உட்பட்ட ஒரு சிறிய மற்றும் அமைதியான கிராமம். இது அணைக்கட்டு (Anaicut) வட்டத்தில் அமைந்துள்ளது. இயற்கை சூழலும், பசுமையும் நிறைந்த ஒரு பாரம்பரிய கிராமமாகும்.
            </p>
            
            <p class="about-description english-text">
              With a population of around 150 families, PANANGADU thrives on agriculture,
              handicrafts, and community spirit. Every sunrise brings the scent of jasmine
              from the temple courtyard, the sound of cowbells in the morning mist,
              and the sight of women in vibrant saris drawing water from the village well.
            </p>

            <div class="about-description tamil-text">
              <strong>Panangadu கிராமத்தில் முக்கிய திருவிழாக்கள்:</strong>
              <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                <li>பொங்கல்</li>
                <li>தீபாவளி</li>
                <li>கோவில் திருவிழா (தேர் திருவிழா)</li>
                <li>ஆடி திருவிழா</li>
              </ul>
              <p style="margin-top: 0.5rem;">இவை கிராம ஒற்றுமையை அதிகரிக்கும்.</p>
            </div>
          </div>\r`;

lines.splice(136, 24, newHTML);

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('Fixed typography tags in index.html!');
