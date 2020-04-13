import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { projectSelector } from '../slices/project'; 
import { releasesSelector, resetReleases, updateReleases } from '../slices/releases';

import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';

interface Props {
  className?: string,
};

const ReleaseTypeahead = (props: Props) => {
  const dispatch = useDispatch();
  const { project } = useSelector(projectSelector);
  const { releases } = useSelector(releasesSelector);

  useEffect(() => {
    dispatch(resetReleases());
  }, [dispatch, project]);

  return (
    <Form.Group className={props.className} controlId="releases">
      <Form.Label>Releases</Form.Label>
      <Typeahead
        disabled={!project}
        dropup
        id="releases"
        labelKey="name"
        multiple
        onChange={releases => dispatch(updateReleases(releases))}
        options={project ? project.releases : []}
        placeholder="Click or start typing release..."
        selected={releases} />
    </Form.Group>
  );
};

export default ReleaseTypeahead;