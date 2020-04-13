import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Project, projectSelector, updateProject } from '../slices/project'; 
import { fetchProjects, projectsSelector } from '../slices/projects';

import Form from 'react-bootstrap/Form';
import { Highlighter, Typeahead, TypeaheadMenuProps, TypeaheadResult } from 'react-bootstrap-typeahead';

interface Props {
  className?: string,
};

const ProjectTypeahead = (props: Props) => {
  const dispatch = useDispatch();
  const { project } = useSelector(projectSelector);
  const { hasErrors, isLoading, projects } = useSelector(projectsSelector);

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch]);

  const renderMenuItem = (project: TypeaheadResult<Project>, props: TypeaheadMenuProps<Project>, idx: number) => {
    return(
      <Fragment>
        <Highlighter key={project["key"]} search={props.text}>{project["key"]}</Highlighter>
        <div className="text-muted" key="title">
          <small>{project["name"]}</small>
        </div>
      </Fragment>
    )
  };

  return (
    <div className={props.className || ""}>
      <Form>
        <Form.Group controlId="projectKey">
          <Typeahead
            bsSize="large"
            id="projectKey"
            labelKey="key"
            options={projects}
            onChange={selected => selected.length ? dispatch(updateProject(selected[0])) : null}
            placeholder="Find a project..."
            renderMenuItemChildren={renderMenuItem} />
        </Form.Group>
      </Form>
      <h6 className="text-muted card-subtitle mb-2">
        {project ? project["name"] : "No project selected"}
      </h6>
    </div>
  );
};

export default ProjectTypeahead;