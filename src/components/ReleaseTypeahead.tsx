import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { configSelector, resetReleases, setReleases } from '../slices/config';

import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';

interface Props {
  className?: string,
};

const ReleaseTypeahead = (props: Props) => {
  const dispatch = useDispatch();
  const { project, releases } = useSelector(configSelector);

  useEffect(() => {
    if (!releases.length) return;
    dispatch(resetReleases());
  }, [dispatch, project, releases]);

  return (
    <Form.Group className={props.className} controlId="releases">
      <Form.Label>Releases</Form.Label>
      <Typeahead
        disabled={!project}
        dropup
        id="releases"
        labelKey="name"
        multiple
        onChange={releases => dispatch(setReleases(releases))}
        options={project ? project.releases : []}
        placeholder="Click or start typing release..."
        selected={releases} />
    </Form.Group>
  );
};

export default ReleaseTypeahead;