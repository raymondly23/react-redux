import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';

class ManageCoursePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      course: Object.assign({}, props.course),
      errors: {}
    };
    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
   if(this.props.course.id != nextProps.course.id) {
    this.setState({course: Object.assign({}, nextProps.course)});
   }     
  }

  updateCourseState(event) {
    let course = this.state.course;
    const field = event.target.name;
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  saveCourse(event) {
    event.preventDefault();
    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect());
  }

  redirect() {
    this.context.router.push('/courses');
  }

  render() {
    return (
      <CourseForm 
        allAuthors={this.props.authors}
        onChange={this.updateCourseState}
        onSave={this.saveCourse}
        course={this.state.course}
        errors={this.state.errors}
      />
    );
  }
}

ManageCoursePage.propTypes = {
  actions: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired
};

ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

function getCourseById(courses, id) {
  const course = courses.filter(course => course.id == id);
  if(course) return course[0];
  return null;
}

function mapStateToProps(state, ownProps) {
  let course = {id: "", watchHref: "", title: "", authorId: "", length: "", category: ""};
  const courseId = ownProps.params.id;

  if(courseId && state.courses.length > 0) {
    course = getCourseById(state.courses, courseId);
  }
  const authorsFormattedForDropdown = state.authors.map(author => {
    return {
      value: author.id,
      text: author.firstName + " " + author.lastName
    };
  });
  return {
    course: course,
    authors: authorsFormattedForDropdown
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);