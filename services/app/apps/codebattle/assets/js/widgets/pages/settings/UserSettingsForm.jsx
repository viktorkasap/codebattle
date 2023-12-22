import React from 'react';

import Slider from 'calcite-react/Slider';
import {
 Formik, Form, Field, useField,
} from 'formik';
import capitalize from 'lodash/capitalize';
import * as Icon from 'react-feather';
import * as Yup from 'yup';

import languages from '../../config/languages';
import { createPlayer } from '../../lib/sound';

const playingLanguages = Object.entries(languages);

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { name } = props;

  return (
    <div className="form-group mb-3">
      <label className="h6" htmlFor={name}>{label}</label>
      <input {...field} {...props} className="form-control" />
      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
    </div>
  );
};

const UserSettingsForm = ({ onSubmit, settings }) => {
  const initialValues = {
    name: settings.name,
    soundSettings: {
      type: settings.soundSettings.type,
      level: settings.soundSettings.level,
    },
    lang: settings.lang || '',
  };

  const player = createPlayer();

  const playSound = (type, volume) => {
    player.stop();
    player[type].play('win', volume);
  };

  const validationSchema = Yup.object({
    name: Yup.string()
            .strict()
            .required("Field can't be empty")
            .min(3, 'Should be at least 3 characters')
            .max(16, 'Should be 16 character(s) or less')
            .trim(),
  });

  return (
    <Formik
      initialValues={initialValues}
      initialTouched={{ name: true }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        handleChange, dirty, isValid, isSubmitting, values,
      }) => (
        <Form>
          <div className="container">
            <div className="row form-group mb-3">
              <div className="col-lg-3">
                <TextInput
                  className="col-5"
                  data-testid="nameInput"
                  label="Your name"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                />
              </div>
              <div className="col-lg-3">
                <div className="h6">Your weapon</div>
                <Field
                  as="select"
                  data-testid="langSelect"
                  aria-label="Programming language select"
                  name="lang"
                  className="custom-select"
                >
                  {playingLanguages.map(([slug, lang]) => (
                    <option key={slug} value={slug}>
                      {capitalize(lang)}
                    </option>
                  ))}
                </Field>
              </div>
            </div>
          </div>

          <div id="my-radio-group" className="h6 ml-2">
            Select sound type
          </div>
          <div
            role="group"
            aria-labelledby="my-radio-group"
            className="ml-3 mb-3"
          >
            <div className="form-check">
              <Field
                id="radioDendy"
                type="radio"
                name="sound_settings.type"
                value="dendy"
                className="form-check-input"
                onClick={() => playSound('dendy', values.soundSettings.level * 0.1)}
              />
              <label className="form-check-label" htmlFor="radioDendy">Dendy</label>
            </div>
            <div className="form-check">
              <Field
                id="radioCS"
                type="radio"
                name="sound_settings.type"
                value="cs"
                className="form-check-input"
                onClick={() => playSound('cs', values.soundSettings.level * 0.1)}
              />
              <label className="form-check-label" htmlFor="radioCS">CS</label>
            </div>
            <div className="form-check">
              <Field
                id="radioStandart"
                type="radio"
                name="sound_settings.type"
                value="standart"
                className="form-check-input"
                onClick={() => playSound('standart', values.soundSettings.level * 0.1)}
              />
              <label className="form-check-label" htmlFor="radioStandart">Standart</label>
            </div>
            <div className="form-check">
              <Field
                id="radioSilent"
                type="radio"
                name="sound_settings.type"
                value="silent"
                className="form-check-input"
              />
              <label className="form-check-label" htmlFor="radioSilent">Silent</label>
            </div>
          </div>

          <div className="h6 ml-2">Select sound level</div>
          <div className="ml-2 mb-3 d-flex align-items-center">
            <Icon.VolumeX />
            <Field
              component={Slider}
              type="range"
              min={0}
              max={10}
              name="sound_settings.level"
              disabled={values.soundSettings.type === 'silent'}
              onInput={e => {
                handleChange(e);
                playSound(values.soundSettings.type, e.target.value * 0.1);
              }}
              className="ml-3 mr-3 form-control"
            />
            <Icon.Volume2 />
          </div>

          <div className="d-flex justify-content-center">
            <button
              disabled={!dirty || !isValid}
              aria-label="SubmitForm"
              style={{ width: '120px' }}
              type="submit"
              className="btn py-1 btn-primary rounded-lg"
            >
              {isSubmitting ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserSettingsForm;
