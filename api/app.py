from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd
from features import features
import os

model_filename = 'rate_regressor.joblib'
model = joblib.load(model_filename)

app = Flask(__name__, static_folder='../assets', template_folder='../')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        re_ordered = {
            'Type': [data['type']],
            'Episodes': [data['episodes']],
            'Release_year': [data['releaseYear']],
            'Release_season': [data['releaseSeason']],
            'Studio': data['studio'],
            'warnings_count': [data['warningCount']],
            'rel_anim_count': [data['similarAnimes']],
            'rel_mang_count': [data['similarMangas']],
            'voice_act_count': [data['voiceActorCount']],
            'rel_media_count': [data['similarMediaCount']],
            'staff_count': [data['staffCount']],
            'tags_count': [data['genreCount']]
        }
        df = pd.DataFrame(re_ordered, columns=features)
        prediction = model.predict(df).tolist()

        return jsonify(round(prediction[0], 2))

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))