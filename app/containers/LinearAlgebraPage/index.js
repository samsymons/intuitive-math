/*
 * LinearAlgebraPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import PropTypes from 'prop-types';

import styled from 'styled-components';
import MathJax from 'react-mathjax';

import { DoubleSide, Euler, Matrix3, Vector3 } from 'three';

import { Axis, XAxis, YAxis, ZAxis } from 'components/Axis';
import Animation from 'components/Animation';
import Plane from 'components/Plane';
import Section from 'components/Section';
import Vector from 'components/Vector';
import Visualization, { BlankableVisualization } from 'components/Visualization';

import injectReducer from 'utils/injectReducer';

import reducer from './reducer';

const Strong = styled.span`
  font-weight: bold
`;

const MathJaxMatrix = ({ matrix, ...props }) => (
  <MathJax.Node {...props}>{`\\begin{bmatrix} ${matrix.map((row) => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix}`}</MathJax.Node>
);

MathJaxMatrix.propTypes = {
  matrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
};

const truncate = (num, precision) => {
  const power = 10 ** precision;
  return Math.floor(num * power) / power;
};

const SpacesSection = () => (
  <Section title="Co-ordinate Systems" anchor="spaces">
    <div>
      <p>
        If we want to think about things geometrically, we need a way to describe
        where things are in space, where things are in relation to each other
        and how big they are.
      </p>
      <p>
        To do that, we can use a co-ordinate system. <Strong>Linear</Strong>{' '}
        co-ordinate systems have two properties - <Strong>units</Strong> and{' '}
        <Strong>dimensions</Strong>. The dimensions correspond to how many different
        combinations you can make with positions in your space. We will often
        see dimensions referred to by the canonical variables{' '}
        <MathJax.Node inline>{'x'}</MathJax.Node>, <MathJax.Node inline>{'y'}</MathJax.Node>,{' '}
        <MathJax.Node inline>{'z'}</MathJax.Node> and so on.
      </p>
      <Animation
        initial={{ rotation: new Euler(0.5, 0.5, 0) }}
        update={(state) => ({
          rotation: new Euler(state.rotation.x,
                              state.rotation.y + 0.001,
                              state.rotation.z),
        })}
        render={(state) => (
          <Visualization width={320} height={240} rotation={state.rotation}>
            <XAxis />
            <YAxis />
            <ZAxis />
          </Visualization>
        )}
      />
      <p>
        There exist infinitely many points in the other corresponding
        dimensions for a single point on one dimension. For instance, if you
        had a two dimensional space and you held <MathJax.Node inline>{'x'}</MathJax.Node>
        constant at <MathJax.Node inline>{'x = 1'}</MathJax.Node>, there are
        still infinitely many points you could pick on the <MathJax.Node inline>{'y'}</MathJax.Node>{' '}
        dimension. If you had a three dimensional space and held <MathJax.Node inline>{'x'}</MathJax.Node>{' '}
        at <MathJax.Node inline>{'x = 1'}</MathJax.Node>, there are infinitely
        many points that you could choose in the <MathJax.Node inline>{'y'}</MathJax.Node>{' '}
        dimension, and then after that, there are infinitely many points you could
        choose in the <MathJax.Node inline>{'z'}</MathJax.Node> dimension.
      </p>
      <p>
        In the <Strong>first</Strong> dimension you would just have a number
        line made up of every possible point
      </p>
      <BlankableVisualization width={320} height={240}>
        <XAxis />
      </BlankableVisualization>
      <p>
        In <Strong>two</Strong> dimensional space, you have a co-ordinate plane
        made up of every possible line
      </p>
      <BlankableVisualization width={320} height={240}>
        <XAxis />
        <YAxis />
      </BlankableVisualization>
      <p>
        In <Strong>three</Strong> dimensional space, you have a volume
        made up of every possible plane
      </p>
      <BlankableVisualization width={320} height={240} rotation={new Euler(0.5, 0.5, 0)}>
        <XAxis />
        <YAxis />
        <ZAxis />
      </BlankableVisualization>
      <p>
        Dimensions above the fourth are a little tricky to visualize, but the
        pattern continues. If two-dimensional space is a plane consisting of
        consists of every possible line and three-dimensional space is a volume
        consisting of every possible plane, then think about what that means
        for four-dimensional space. Or even five-dimensional space.
      </p>
      <p>The logic will generalize to an n-dimensional space</p>
      <p>
        For the sake of simplicitly, we will assume
        that all co-ordinate systems use the same units, meaning that movement
        of one step along one dimension and that if you rotated a system
        such that the one dimension became another, the steps would correspond.
      </p>
    </div>
  </Section>
);

const VectorsSection = () => (
  <Section title="Vectors" anchor="vectors">
    <p>The fundamental building block of linear systems is the humble <Strong>Vector</Strong></p>
    <Animation
      initial={{ rotation: new Euler(0.5, 0.5, 0) }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(2, 2, 2)} color={0xff8800} />
        </Visualization>
      )}
    />
    <p>
      There is a few different ways to think about vectors. It is not quite right
      to call them a point, because vectors have a direction that is actually
      computable. But then they are not just a pure direction with no associated
      point.
    </p>
    <p>
      Personally, I find it best to think of them as a recipie to get to a point
      based on our understanding of dimensions above. When you plot the vector,
      it shows you the fastest way of getting to that point in space.
    </p>
    <p>
      For instance, the vector above is at the position <MathJax.Node inline>{'(5, 5, 5)'}</MathJax.Node>{' '}.
      Another way to think about it might be that it is <MathJax.Node inline>{'5'}</MathJax.Node>{' '}
      steps in the <MathJax.Node inline>{'x'}</MathJax.Node>{' '} direction,{' '}
      <MathJax.Node inline>{'5'}</MathJax.Node>{' '}
      steps in the <MathJax.Node inline>{'y'}</MathJax.Node>{' '} and{' '}
      <MathJax.Node inline>{'5'}</MathJax.Node>{' '}
      steps in the <MathJax.Node inline>{'z'}</MathJax.Node>{' '} direction.
    </p>
    <p>
      As a slight notational detour, we represent vectors using a kind of shorthand
      that takes away the <MathJax.Node inline>{'x'}</MathJax.Node>,{' '}
      <MathJax.Node inline>{'y'}</MathJax.Node>{' '}, <MathJax.Node inline>{'z'}</MathJax.Node>{' '}
      etc and just replaces them with a series of numbers in vertical square
      brackets, each slot representing a different dimension:
    </p>
    <MathJaxMatrix matrix={[[1], [2], [3]]} />
    <p>
      This makes more sense if you look at the most degenerate case and then
      build up. For instance, take a one-dimensional space, the number line,
      where we only have an <MathJax.Node inline>{'x'}</MathJax.Node> axis.
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const xPosition = truncate(Math.sin(state.time * 0.05), 2);
        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <Vector position={new Vector3(2 * xPosition, 0, 0)} color={0xff8800} />
            </Visualization>
            <div>
              <MathJax.Node inline>{'x ='}</MathJax.Node>{' '}<span>{xPosition}</span>
            </div>
          </div>
        );
      }}
    />
    <p>
      Now let us have a look at a vector which ranges around a circle on the
      <MathJax.Node inline>{'x'}</MathJax.Node> and <MathJax.Node inline>{'y'}</MathJax.Node> axis.
      Notice that we are still doing the same thing along the x axis, but we are
      sort of translating the whole line up and down whilst the vector
      move along the same line.
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const xPosition = truncate(Math.sin(state.time * 0.05), 2);
        const yPosition = truncate(Math.cos(state.time * 0.05), 2);
        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(2 * xPosition, 2 * yPosition, 0)} color={0xff8800} />
              <Vector position={new Vector3(2 * xPosition, 2 * yPosition, 0)} color={0xff8800} base={new Vector3(0, 2 * yPosition, 0)} />
            </Visualization>
            <div>
              <MathJax.Node inline>{'x ='}</MathJax.Node>{' '}<span>{xPosition}</span>
            </div>
            <div>
              <MathJax.Node inline>{'y ='}</MathJax.Node>{' '}<span>{yPosition}</span>
            </div>
          </div>
        );
      }}
    />
    <p>
      Extending this to the third dimension is fairly straightforward. If we can
      imagine our 2D animation running on a flat surface, then in 3D all we are
      really doing is moving the plane which is that flat surface, around.
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const xPosition = truncate(Math.sin(state.time * 0.05), 2);
        const yPosition = truncate(Math.cos(state.time * 0.05), 2);
        const zPosition = truncate(Math.sin(state.time * 0.005), 2);
        return (
          <div>
            <Visualization width={320} height={240} rotation={new Euler(0.5, 0.5, 0)}>
              <XAxis />
              <YAxis />
              <ZAxis />
              <Vector position={new Vector3(2 * xPosition, 2 * yPosition, 2 * zPosition)} color={0xff8800} base={new Vector3(2 * xPosition, 0, 2 * zPosition)} />
              <Vector position={new Vector3(2 * xPosition, 2 * yPosition, 2 * zPosition)} color={0xff8800} base={new Vector3(0, 2 * yPosition, 2 * zPosition)} />
              <Vector position={new Vector3(2 * xPosition, 2 * yPosition, 2 * zPosition)} color={0xff8800} />
            </Visualization>
            <div>
              <MathJax.Node inline>{'x ='}</MathJax.Node>{' '}<span>{xPosition}</span>
            </div>
            <div>
              <MathJax.Node inline>{'y ='}</MathJax.Node>{' '}<span>{yPosition}</span>
            </div>
            <div>
              <MathJax.Node inline>{'z ='}</MathJax.Node>{' '}<span>{zPosition}</span>
            </div>
          </div>
        );
      }}
    />
    <p>
      Addition and subtraction on vectors is defined in the usual sense. Analytically
      we just add each component and create a new vector.
    </p>
    <p>
      <MathJaxMatrix matrix={[[1], [2], [3]]} inline />{'+ '}
      <MathJaxMatrix matrix={[[1], [2], [3]]} inline />{'= '}
      <MathJaxMatrix matrix={[[2], [4], [6]]} inline />
    </p>
    <p>
      Geometrically you can think of this as adding head to tail, or following
      the steps indicated by the first vector, then following the steps
      indicated by the second
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const a = new Vector3(1, 2, 0);
        const b = new Vector3(2 * lerp, 1 * lerp, 0);
        const c = new Vector3();

        c.addVectors(a, b);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={a} color={0xffff00} />
              <Vector position={c} color={0xff00ff} base={a} />
              <Vector position={c} color={0x00ffff} />
            </Visualization>
            <div>
              <MathJax.Node inline>{'x ='}</MathJax.Node>{' '}<span>{a.x}{' + '}{truncate(b.x, 2)}{' = '}{truncate(c.x, 2)}</span>
            </div>
            <div>
              <MathJax.Node inline>{'y ='}</MathJax.Node>{' '}<span>{a.y}{' + '}{truncate(b.y, 2)}{' = '}{truncate(c.y, 2)}</span>
            </div>
          </div>
        );
      }}
    />
    <p>
      Of course, note that this only works if the two vectors have the same
      number of dimensions.
    </p>
    <p>
      Also note that vector multiplication is not defined in the usual sense -
      you cannot just take the components of each vector and multiply them together.
      If you did that, you would lose directional information, because what you
      are really doing in that case is scaling each component by a different
      number.
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const a = new Vector3(1, 2, 0);
        const b = new Vector3(2 * lerp, 1 * lerp, 0);
        const c = new Vector3(a.x * b.x, a.y * b.y, 0);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={a} color={0xffff00} />
              <Vector position={b} color={0xff00ff} />
              <Vector position={c} color={0x00ffff} />
            </Visualization>
            <div>
              <MathJax.Node inline>{'x ='}</MathJax.Node>{' '}<span>{a.x}{' * '}{truncate(b.x, 2)}{' = '}{truncate(c.x, 2)}</span>
            </div>
            <div>
              <MathJax.Node inline>{'y ='}</MathJax.Node>{' '}<span>{a.y}{' * '}{truncate(b.y, 2)}{' = '}{truncate(c.y, 2)}</span>
            </div>
          </div>
        );
      }}
    />
  </Section>
);

const MatricesSection = () => (
  <Section title="Matrices" anchor="matrices">
    <p>
      The traditional way of thinking about matrices is as systems of linear
      equations. For instance, you might have the following two equations:
    </p>
    <MathJax.Node>{'2x + 3y = 4'}</MathJax.Node>
    <MathJax.Node>{'6x + 2y = 1'}</MathJax.Node>
    <p>
      Those two equations are telling you about two relationships between
      the variables <MathJax.Node inline>{'x'}</MathJax.Node> and{' '}
      <MathJax.Node inline>{'y'}</MathJax.Node>. With those two relationships, you
      can solve for what those variables are.
    </p>
    <p>
      If you only had one equation, you do not have enough information to
      solve for both <MathJax.Node inline>{'x'}</MathJax.Node> and{' '}
      <MathJax.Node inline>{'y'}</MathJax.Node>. In fact, they could be anything
      that satisfies the relationship, or anything on the line
      <MathJax.Node inline>{'2x + 3y = 4'}</MathJax.Node>, which after
      a little bit of algebra, we can represent like this:
    </p>
    <MathJax.Node>{'2x + 3y = 4'}</MathJax.Node>
    <MathJax.Node>{'3y = 4 - 2x'}</MathJax.Node>
    <MathJax.Node>{'y = \\frac{4 - 2x}{3}'}</MathJax.Node>
    <p>
      And if you graphed that line, you would see that valid solution that
      satisfies that relationship exists anywhere on that line
    </p>
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector position={new Vector3(100, -65.3, 0)} color={0xffff00} />
    </BlankableVisualization>
    <p>
      However, once we add the other line, as long as they are not parallel,
      then the two will intersect in one place and we will have a single
      solution for both <MathJax.Node inline>{'x'}</MathJax.Node> and{' '}
      <MathJax.Node inline>{'y'}</MathJax.Node>.
    </p>
    <MathJax.Node>{'6x + 2y = 1'}</MathJax.Node>
    <MathJax.Node>{'2y = 1 - 6x'}</MathJax.Node>
    <MathJax.Node>{'y = \\frac{1 - 6x}{2}'}</MathJax.Node>
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector position={new Vector3(100, -65.3, 0)} color={0xff00ff} />
      <Vector position={new Vector3(100, -299.5, 0)} color={0xffff00} />
    </BlankableVisualization>
    <p>
      A matrix is just a shorthand way of expressing such a system of equations
      where we take away the variables and put the entire system in square
      brackets.
    </p>
    <MathJaxMatrix matrix={[[2, 3], [6, 2]]} />
    <p>
      Comparing this matrix to the system of equations above, it is now possible
      to see what is being represented here. Since each row contains
      an <MathJax.Node inline>{'x'}</MathJax.Node> and a{' '}
      <MathJax.Node inline>{'y'}</MathJax.Node>, you could say that each row
      itself is a vector. But then, like with the number of equations above, the
      number of rows tells you at most how many variables you can solve for. In
      some cases you will not always be able to solve for a variable, despite
      there being enough rows to be able to solve for it, but that actually
      tells you something about the underlying equations themselves.
    </p>
    <p>
      Generalizing a little bit further, the each row gives you a piece of
      information about the input space and each column gives you a piece
      of information about the output space.
    </p>
    <p>
      If we were to visualize the rows of that matrix, we have these vectors:
    </p>
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector position={new Vector3(2, 3, 0)} color={0xff00ff} />
      <Vector position={new Vector3(6, 2, 0)} color={0xffff00} />
    </BlankableVisualization>
    <p>
      And if we were to visualize the columns of that matrix, we have these vectors:
    </p>
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector position={new Vector3(2, 6, 0)} color={0xff00ff} />
      <Vector position={new Vector3(3, 2, 0)} color={0xffff00} />
    </BlankableVisualization>
    <p>
      Matrix-matrix addition and subtraction is not very interesting - you just
      add up all the components. Again, the two matrices need to be the same
      size in order for this to work. So for instance, if we wanted to add
      the following matrices:
    </p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 1], [2, 0]]} />{' + '}
      <MathJaxMatrix inline matrix={[[2, 1], [1, 1]]} />
    </p>
    <p>
      You would end up adding each separate vector component together, which
      we would visualize like so:
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const a1 = new Vector3(1, 1, 0);
        const b1 = new Vector3(2 * lerp, 1 * lerp, 0);
        const c1 = new Vector3(a1.x + b1.x, a1.y + b1.y, 0);

        const a2 = new Vector3(2, 0, 0);
        const b2 = new Vector3(1 * lerp, 1 * lerp, 0);
        const c2 = new Vector3(a2.x + b2.x, a2.y + b2.y, 0);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={a1} color={0xffff00} />
              <Vector position={c1} color={0xffff00} base={a1} />
              <Vector position={c1} color={0xffff00} />
              <Vector position={a2} color={0x00ff00} />
              <Vector position={c2} color={0x00ff00} base={a2} />
              <Vector position={c2} color={0x00ff00} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      Matrix-vector multiplication is where things get a little more interesting
      since what we are doing here is transforming the vector by putting it
      into the output space described by the vectors in the matrix.
    </p>
    <p>
      This is defined by, for each row, multiplying each entry in each column
      by each entry in each row of the vector and then adding up the result
      into the output row. Remember that the output space is described by
      the number of rows in the matrix, so you will end up with a vector that
      has as many dimensions as the matrix has rows. In order for the operation
      to work, you need to have as many as you have rows in the vector
      you will be multiplying by. For instance, this transformation is going
      to scale the existing vector by 2 units in the <MathJax.Node inline>{'x'}</MathJax.Node>
      direction and 2 units in the y direction <MathJax.Node inline>{'y'}</MathJax.Node>:
    </p>
    <p>
      <MathJaxMatrix matrix={[[2, 0], [0, 2]]} inline />
      <MathJaxMatrix matrix={[[3], [1]]} inline />
      {' = '}<MathJaxMatrix matrix={[[6 + 0], [0 + 2]]} inline />
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const mat = new Matrix3();
        const input = new Vector3(3, 1, 0);

        mat.set(1 + (1 * lerp), 0, 0,
                0, 1 + (1 * lerp), 0,
                0, 0, 0);

        const output = input.clone().applyMatrix3(mat);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(mat.elements[0], mat.elements[1], 0)} color={0xffff00} />
              <Vector position={new Vector3(mat.elements[3], mat.elements[4], 0)} color={0xffff00} />
              <Vector position={output} color={0xff00ff} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      What is more interesting is when you have transformations that are not
      purely scalar. For instance, this transformation is going to move
      the vector 1 unit in the <MathJax.Node inline>{'x'}</MathJax.Node> direction
      for every unit that it has in the <MathJax.Node inline>{'y'}</MathJax.Node>{' '}
      direction.
    </p>
    <p>
      <MathJaxMatrix matrix={[[1, 1], [0, 1]]} inline />
      <MathJaxMatrix matrix={[[2], [3]]} inline />
      {' = '}<MathJaxMatrix matrix={[[5 + 0], [0 + 3]]} inline />
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const mat = new Matrix3();
        const input = new Vector3(2, 3, 0);

        mat.set(1, (1 * lerp), 0,
                0, 1, 0,
                0, 0, 0);

        const output = input.clone().applyMatrix3(mat);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(mat.elements[0], mat.elements[1], 0)} color={0xffff00} />
              <Vector position={new Vector3(mat.elements[3], mat.elements[4], 0)} color={0xffff00} />
              <Vector position={output} color={0xff00ff} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      As we do these transformations, pay attention to the two yellow vectors
      and their relationship with the magenta vector. The two yellow vectors
      are something called a <Strong>basis</Strong> for the 2D space, something
      we will revisit later. They are being interpolated from their default
      position to the position specified in the matrix.
    </p>
    <p>
      This one just takes every step in the x direction and translates
      the vector that much in the y direction and vice versa. As such, it is
      a reflection.
    </p>
    <p>
      <MathJaxMatrix matrix={[[0, 1], [1, 0]]} inline />
      <MathJaxMatrix matrix={[[2], [3]]} inline />
      {' = '}<MathJaxMatrix matrix={[[3], [2]]} inline />
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const mat = new Matrix3();
        const input = new Vector3(2, 3, 0);

        mat.set(1 - (1 * lerp), (1 * lerp), 0,
                (1 * lerp), 1 - (1 * lerp), 0,
                0, 0, 0);

        const output = input.clone().applyMatrix3(mat);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(mat.elements[0], mat.elements[1], 0)} color={0xffff00} />
              <Vector position={new Vector3(mat.elements[3], mat.elements[4], 0)} color={0xffff00} />
              <Vector position={output} color={0xff00ff} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      This one actually rotates the whole system around by about
      90 degrees, by moving down in the y direction for every step
      in the x direction and moving right in the x direction for every
      step in the y direction.
    </p>
    <p>
      <MathJaxMatrix matrix={[[0, 1], [-1, 0]]} inline />
      <MathJaxMatrix matrix={[[2], [3]]} inline />
      {' = '}<MathJaxMatrix matrix={[[3], [-2]]} inline />
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const mat = new Matrix3();
        const input = new Vector3(2, 3, 0);

        mat.set(1 - (1 * lerp), (1 * lerp), 0,
                -lerp, 1 - (1 * lerp), 0,
                0, 0, 0);

        const output = input.clone().applyMatrix3(mat);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(mat.elements[0], mat.elements[1], 0)} color={0xffff00} />
              <Vector position={new Vector3(mat.elements[3], mat.elements[4], 0)} color={0xffff00} />
              <Vector position={output} color={0xff00ff} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      What about multiplying two matrices? Well, we can take what we know about
      matrices - the fact that they are sets of vectors, the rows represent
      the input space and the columsn represent the output space and our
      definition of matrix-vector multiplication to multiply two matricies by{' '}
      ...multiplying each column vector in the right hand
      matrix by the left hand side matrix.
    </p>
    <p>
      To make things a little simpler, I have color-coded the the vectors
      in the right hand matrix. The yellow vector represents
      first column and the magenta vector represents the second column.
    </p>
    <p>
      <MathJaxMatrix matrix={[[2, 0], [0, 2]]} inline />
      <MathJaxMatrix matrix={[[3, 1], [1, 1]]} inline />
      {' = '}<MathJaxMatrix matrix={[[6, 2], [2, 2]]} inline />
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const mat = new Matrix3();
        const input = new Matrix3();

        input.set(3, 1, 0,
                  1, 1, 0,
                  0, 0, 0);
        mat.set(1 + (1 * lerp), 0, 0,
                0, 1 + (1 * lerp), 0,
                0, 0, 0);

        const output = input.clone().multiply(mat);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(mat.elements[0], mat.elements[1], 0)} color={0x00ffff} />
              <Vector position={new Vector3(mat.elements[3], mat.elements[4], 0)} color={0x00ffff} />
              <Vector position={new Vector3(output.elements[0], output.elements[1], 0)} color={0xff00ff} />
              <Vector position={new Vector3(output.elements[3], output.elements[4], 0)} color={0xffff00} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      Again, notice what happens to each vector in the second matrix as the
      transformation in the first is applied to it. In the second matrix,
      we had the vector <MathJax.Node inline>{'(1, 1)'}</MathJax.Node>, which got scaled
      2 in the x-direction for every component of its x-direction and 2 in
      the y-direction for every component in the y direction. So it ended
      up on <MathJax.Node inline>{'(2, 2)'}</MathJax.Node>.
    </p>
    <p>
      Similarly, for the vector <MathJax.Node inline>{'(3, 1)'}</MathJax.Node>, it was also scaled
      2 in the x-direction for every component of its x-direction and 2 in
      the y-direction for every component in the y direction. So it ended
      up on <MathJax.Node inline>{'(6, 2)'}</MathJax.Node>.
    </p>
    <p>
      Here is something a little more complicated - we will apply the same
      rotation that we did earlier.
    </p>
    <MathJaxMatrix matrix={[[0, 1], [-1, 0]]} inline />
    <MathJaxMatrix matrix={[[3, 1], [1, 1]]} inline />
    {' = '}<MathJaxMatrix matrix={[[1, 1], [-3, -1]]} inline />
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const mat = new Matrix3();
        const input = new Matrix3();

        input.set(3, 1, 0,
                  1, 1, 0,
                  0, 0, 0);
        mat.set(1 - (1 * lerp), (1 * lerp), 0,
                -lerp, 1 - (1 * lerp), 0,
                0, 0, 0);

        const output = mat.clone().multiply(input);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(mat.elements[0], mat.elements[1], 0)} color={0x00ffff} />
              <Vector position={new Vector3(mat.elements[3], mat.elements[4], 0)} color={0x00ffff} />
              <Vector position={new Vector3(output.elements[0], output.elements[1], 0)} color={0xff00ff} />
              <Vector position={new Vector3(output.elements[3], output.elements[4], 0)} color={0xffff00} />
            </Visualization>
          </div>
        );
      }}
    />
  </Section>
);

const LinearIndependenceSection = () => (
  <Section title="Linear Independence" anchor="linear-independence">
    <p>
      Much ado gets made about linear independence, probably because it makes up
      quite a few questions where the answer is not immediately obvious. It is
      also a bit of terminology that gets in the way of understanding. Its hard
      to imagine vectors being dependent on each other, surely they can be
      manipulated independently?
    </p>
    <p>
      When we talk about linear independence what we are actually talking about
      is whether a vector in a set of vectors actually gives us the freedom
      to move in another dimension or whether it is trapped in the same dimension
      already described by other vectors.
    </p>
    <p>
      Of course, even that is a little misleading. You could have vectors with
      non-zero numbers in every dimension but they still may be linearly
      dependent. So what we are actually talking about is whether that vector
      in combination with other vectors gives us access to more space. This is
      best illustrated in the two dimensional case with a visual explanation.
    </p>
    <MathJaxMatrix inline matrix={[[1, 2], [2, 4]]} />
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector position={new Vector3(1, 2, 0)} color={0xffff00} />
      <Vector position={new Vector3(2, 4, 0)} color={0xff00ff} />
    </BlankableVisualization>
    <p>
      These two vectors are not linearly independent. The reason why is that
      the first vector describes the line <MathJax.Node inline>{'y = 2x'}</MathJax.Node>{' '}
      and the second vector describes the line <MathJax.Node inline>{'2y = 4x'}</MathJax.Node>.
    </p>
    <p>
      But that is the exact same line! If we were to add any scalar multiple
      of these two vectors, you would still get another vector that describes the
      line <MathJax.Node inline>{'y = 2x'}</MathJax.Node>. So we say that they
      are <Strong>Linearly Dependent</Strong>
    </p>
    <p>
      Linear dependence is kind of obvious in the 2-vectors, 2-dimensions case, because
      it basically only comes up when the set of vectors are just scalar multiples
      of each other.  But what happens if you have 3 vectors in a two dimensional space?
    </p>
    <MathJaxMatrix inline matrix={[[1], [2]]} />
    <MathJaxMatrix inline matrix={[[1], [1]]} />
    <MathJaxMatrix inline matrix={[[4], [5]]} />
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector position={new Vector3(1, 1, 0)} color={0xffff00} />
      <Vector position={new Vector3(1, 2, 0)} color={0xff00ff} />
      <Vector position={new Vector3(4, 5, 0)} color={0x00fff} />
    </BlankableVisualization>
    <p>
      These vectors are still linearly dependent, even though none of them
      line on the same line. The reason is that now instead of lying on the
      same line, they all line on the same <Strong>plane</Strong>, which by
      definition, is the entire 2D co-ordinate space. By scaling the lines
      describes by <MathJax.Node inline>{'y = x'}</MathJax.Node> and
      <MathJax.Node inline>{'2y = x'}</MathJax.Node>, adding them together
      and so on. I can reach any point in 2D space already. I do not need
      <MathJax.Node inline>{'5y = 4x'}</MathJax.Node> in order to get access
      to any more space.
    </p>
    <p>
      For example, lets make the vector <MathJax.Node inline>{'(4, 5)'}</MathJax.Node>{' '}
      using <Strong>only</Strong> <MathJax.Node inline>{'(1, 1)'}</MathJax.Node>
      and <MathJax.Node inline>{'(1, 2)'}</MathJax.Node>.
    </p>
    <MathJax.Node inline>{'1 * ((1, 2) - (1, 1)) + 4 * (1, 1) = 1 * (0, 1) + 4 * (1, 1) = (4, 5)'}</MathJax.Node>
    <p>
      This is a little more subtle when we move into three dimensions. Just because
      you have three vectors, it doesnt mean that they are all linearly independent.
    </p>
    <p>Obviously, you can get a case where they represent the same line</p>
    <MathJaxMatrix inline matrix={[[1], [2], [3]]} />
    <MathJaxMatrix inline matrix={[[2], [4], [6]]} />
    <MathJaxMatrix inline matrix={[[-1], [-2], [-3]]} />
    <Animation
      initial={{ rotation: new Euler(0.5, 0.5, 0) }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(1, 2, 3)} color={0xffff00} />
          <Vector position={new Vector3(2, 4, 6)} color={0xff00ff} />
          <Vector position={new Vector3(-1, -2, -3)} color={0xffff} />
        </Visualization>
      )}
    />
    <p>But you might also get a case where they, represent the same plane</p>
    <MathJaxMatrix inline matrix={[[1], [1], [1]]} />
    <MathJaxMatrix inline matrix={[[1], [0], [1]]} />
    <MathJaxMatrix inline matrix={[[2], [1], [2]]} />
    <Animation
      initial={{ rotation: new Euler(0.5, 0.5, 0) }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(1, 1, 1)} color={0xffff00} />
          <Vector position={new Vector3(1, 0, 1)} color={0xff00ff} />
          <Vector position={new Vector3(2, 1, 2)} color={0x00ffff} />
          <mesh>
            <parametricGeometry
              parametricFunction={(u, v) =>
                new Vector3(u + v,
                            u,
                            u + v)}
              slices={1}
              stacks={1}
            />
            <meshBasicMaterial color={0x009900} side={DoubleSide} />
          </mesh>
        </Visualization>
      )}
    />
    <p>
      It is not immediately obvious, but adding the third vector to the
      other two does not get you outside of the plane that the other
      two are describing. So they are linearly dependent.
    </p>
    <p>
      So we can get rid of the third vector and still be describing the same
      plane.
    </p>
    <MathJaxMatrix inline matrix={[[1], [1], [1]]} />
    <MathJaxMatrix inline matrix={[[1], [0], [1]]} />
    <Animation
      initial={{ rotation: new Euler(0.5, 0.5, 0) }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(1, 1, 1)} color={0xffff00} />
          <Vector position={new Vector3(1, 0, 1)} color={0xff00ff} />
          <mesh>
            <parametricGeometry
              parametricFunction={(u, v) =>
                new Vector3(u + v,
                            u,
                            u + v)}
              slices={1}
              stacks={1}
            />
            <meshBasicMaterial color={0x009900} side={DoubleSide} />
          </mesh>
        </Visualization>
      )}
    />
  </Section>
);

const SubspacesSection = () => (
  <Section title="Subspaces" anchor="subspaces">
    <p>
      Given some subset of numbers in an n-dimensional space, one of the questions
      you might get asked is whether or not those numbers make up a subspace.
    </p>
    <p>
      To answer that question, it is worth defining what a subspace is in terms
      of its formal properties, then what it is in laymans terms, then the visual
      definition, showing why it is that those properties need to be satisfied.
    </p>
    <p>
      The formal definition of a subspace is as follows:
    </p>
    <ul>
      <li>It must contain the zero-vector</li>
      <li>
        It must be <Strong>closed under addition</Strong>:
        if <MathJax.Node inline>v_1 \in S</MathJax.Node> and{' '}
        <MathJax.Node inline>v_2 \in S</MathJax.Node> for any{' '}
        <MathJax.Node inline>v_1, v_2</MathJax.Node>, then it must
        be true that <MathJax.Node inline>(v_1 + v_2) \in S</MathJax.Node> or
        else <MathJax.Node inline>S</MathJax.Node> is not a subspace.
      </li>
      <li>
        It must be <Strong>closed under scalar multiplication</Strong>:
        if <MathJax.Node inline>v \in S</MathJax.Node> then{' '}
        <MathJax.Node inline>\alpha v \in S</MathJax.Node>, else{' '}
        <MathJax.Node inline>S</MathJax.Node> is not a subspace.
      </li>
    </ul>
    <p>
      All of that was just a fancy way of saying that a subspace just needs
      to define some equal or lesser-dimensional space that ranges from positive infinity
      to negative infinity and passes through the origin.
    </p>
    <p>
      So for instance, valid subspace for a three dimensional space
      might be <MathJax.Node inline>z = 2x + 3y</MathJax.Node>, which is a plane:
    </p>
    <Animation
      initial={{ rotation: new Euler(0.5, 0.5, 0) }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y - 0.001,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <mesh>
            <parametricGeometry
              parametricFunction={(u, v) =>
                new Vector3((-2 * u) + (2 * v),
                            (-2 * u) + v,
                            (-10 * u) + (7 * v))
              }
              slices={1}
              stacks={1}
            />
            <meshBasicMaterial color={0x009900} side={DoubleSide} />
          </mesh>
        </Visualization>
      )}
    />
    <p>
      And does <MathJax.Node inline>{'{(x, y, z): z = 2x + 3y}'}</MathJax.Node> satisfy
      our three propositions? Well, we can prove this with a bit of analysis:
    </p>
    <ul>
      <li>
        Is the zero vector a member of the space? Well:
        <MathJax.Node inline>0 = 2 \times 0 + 3 \times 0</MathJax.Node>, so yes, it is.
      </li>
      <li>
        Is it closed under addition? To work this out, we can take any
        two <MathJax.Node inline>v_1 \in S</MathJax.Node> and{' '}
        <MathJax.Node inline>v_2 \in S</MathJax.Node> and show that
        their sum, <MathJax.Node inline>v_1 + v_2 \in S</MathJax.Node>:
      </li>
    </ul>
    <MathJax.Node>
      v_1 + v_2 = (x_1 + x_2, y_1 + y_2, z_1 + z_2)
    </MathJax.Node>
    <MathJax.Node>
      2x + 3y = z
    </MathJax.Node>
    <MathJax.Node>
      2x + 3y - z = 0
    </MathJax.Node>
    <MathJax.Node>
      2(x_1 + x_2) + 3(y_1 + y_2) - (z_1 + z_2) = 0
    </MathJax.Node>
    <p>
      Or if we rearrange:
    </p>
    <MathJax.Node>
      2x_1 + 2x_2 + 3y_1 + 3y_2 - z_1 - z_2 = 0
    </MathJax.Node>
    <MathJax.Node>
      2x_1 + 3y_1 - z_1 + 2x_2 + 3y_2 - z_2 = 0
    </MathJax.Node>
    <MathJax.Node>
      2x_1 + 3y_1 - z_1 = - 2x_2 - 3y_2 + z_2
    </MathJax.Node>
    <p>
      Now, if we recall that <MathJax.Node inline>2x_1 + 3y_1 - z_1 = 0</MathJax.Node>{' '}
      and <MathJax.Node inline>2x_2 + 3y_2 - z_2 = 0</MathJax.Node>{' '}, so what we really
      have is:
    </p>
    <MathJax.Node>
      0 = -0
    </MathJax.Node>
    <p>Which is always true, so we are closed under addition</p>
    <ul>
      <li>
        Now for being closed under multiplication. Again, we need to prove
        this by analysis:
      </li>
    </ul>
    <MathJax.Node>
      \alpha v_1 = (\alpha x_2, \alpha y_1, \alpha z_2)
    </MathJax.Node>
    <p>
      And if <MathJax.Node inline>v_1 \in S</MathJax.Node> then
      <MathJax.Node inline>2x_1 + 3y_1 = z</MathJax.Node>. So if we multiply
      through <MathJax.Node inline>\alpha</MathJax.Node>:
    </p>
    <MathJax.Node>
      \alpha 2x + \alpha 3y = \alpha z
    </MathJax.Node>
    <p>
      And this is always true, since it is just a scalar.
    </p>
    <p>
      Therefore, as the subset defined by
      <MathJax.Node inline>{'{(x, y, z): 2x + 3y = z}'}</MathJax.Node>
      is a subspace of the volume defined by the three-dimensional real numbers.
    </p>
    <p>
      What about things that are not subspaces? For instance:{' '}
      <MathJax.Node inline>{'{(x, y, z): |x + y + z| = 1}'}</MathJax.Node>
    </p>
    <p>
      Well, this is actually a non-linear function, and we can show that it is
      not a subspace pretty easily through a counterexample, by showing that
      the set is not closed under addition.
    </p>
    <MathJax.Node>
      {'{(1, 1, -1) \\in S}, |1 + 1 - 1| = 1'}
    </MathJax.Node>
    <MathJax.Node>
      {'{(-1, -1, 1) \\in S}, |-1 - 1 + 1| = 1'}
    </MathJax.Node>
    <MathJax.Node>
      {'{(1, 1, -1) + (-1, -1, 1) \\in S}, |1 + 1 - 1 - 1 - 1 + 1| = 0'}
    </MathJax.Node>
    <p>
      So <MathJax.Node inline>{'{(x, y, z): |x + y + z| = 1}'}</MathJax.Node> is
      not a subspace.
    </p>
  </Section>
);

const SpansSection = () => (
  <Section title="Spans" anchor="spans">
    <p>
      Now that we have a better idea of what a <Strong>space</Strong> is and
      what <Strong>linear independence</Strong> is, we can expand our definition
      to a <Strong>span</Strong>.
    </p>
    <p>
      A <Strong>span</Strong> just describes the space reachable by
      <Strong>linear combinations</Strong>{' '} of some given vectors. In fact,
      it is the set of all vectors reachable by linear combinations of vectors
      in the span.
    </p>
    <p>
      What makes this slightly annoying to think about is that that a span
      describes an infinite set and infinite sets are a little hard to reason about.
    </p>
    <p>
      But if we think about it geometrically, it is actually a case that we
      have seen before. Say for instance we have the following vectors
      in 2D space:
    </p>
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector position={new Vector3(1, 0, 0)} color={0xffff00} />
      <Vector position={new Vector3(0, 1, 0)} color={0xff00ff} />
    </BlankableVisualization>
    <p>
      <MathJaxMatrix matrix={[[1], [0]]} inline />{' '}
      <MathJaxMatrix matrix={[[0], [1]]} inline />
    </p>
    <p>
      The span of these two vectors is all of 2D space. The reason for that
      is that you can give me any 2D point and I can tell you two scalar multiples
      of these two vectors that will give you that point.
    </p>
    <p>
      For example, say you wanted the point <MathJax.Node inline>(4, 1)</MathJax.Node>;
      I could say, well, <MathJax.Node inline>(4, 1)</MathJax.Node> is really just
      <MathJax.Node inline>4 \times (1, 0) + 1 \times (0, 1)</MathJax.Node>
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(4 * lerp, 0, 0)} color={0xffff00} />
              <Vector position={new Vector3(0, lerp, 0)} color={0xff00ff} />
              <Vector position={new Vector3(4 * lerp, lerp, 0)} color={0x00ffff} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      Now, what if you had the vectors <MathJaxMatrix inline matrix={[[1], [-1]]} />{' '}
      and <MathJaxMatrix inline matrix={[[-1], [-1]]} />. These two vectors are not
      linearly dependent. Can we reach any point in 2D space using just combinations
      of those two? What about <MathJax.Node inline>(4, 1)</MathJax.Node>?
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;

        const xFirstInterp = 1 + (lerp * 0.5);
        const yFirstInterp = -1 + (lerp * -0.5);

        const xSecondInterp = -1 + (lerp * 3.5);
        const ySecondInterp = -1 + (lerp * 3.5);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(xFirstInterp, yFirstInterp, 0)} color={0xffff00} />
              <Vector position={new Vector3(xSecondInterp, ySecondInterp, 0)} color={0xff00ff} />
              <Vector
                position={new Vector3(xFirstInterp + xSecondInterp,
                                      yFirstInterp + ySecondInterp,
                                      0)}
                color={0x00ffff}
              />
            </Visualization>
            <p>
              {truncate((lerp * 0.5) + 1, 2).toFixed(2)}{' '}<MathJaxMatrix inline matrix={[[1], [-1]]} />{' '}
              {truncate((lerp * -3.5) + 1, 2).toFixed(2)}{' '}<MathJaxMatrix inline matrix={[[-1], [-1]]} />{' '}
            </p>
          </div>
        );
      }}
    />
    <p>
      The answer, if you look at the diagram is that, yes, you can. I can take
      <MathJax.Node inline>1.5</MathJax.Node><MathJaxMatrix inline matrix={[[1], [-1]]} />{' '}
      and <MathJax.Node inline>-2.5</MathJax.Node><MathJaxMatrix inline matrix={[[-1], [-1]]} />{' '};
      adding both gives me <MathJaxMatrix inline matrix={[[4], [4]]} />
    </p>
    <p>
      What if I have the vectors <MathJaxMatrix inline matrix={[[1], [-1]]} />{' '}
      and <MathJaxMatrix inline matrix={[[-1], [1]]} />?
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={new Vector3(2 * lerp, -2 * lerp, 0)} color={0xffff00} />
              <Vector position={new Vector3(lerp * -1, lerp, 0)} color={0xff00ff} />
              <Vector position={new Vector3(4, 1, 0)} color={0x00ffff} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      The answer by the diagram is that you cannot. The two vectors are parallel
      and so it is impossible to combine them in such a way to make{' '}
      <MathJax.Node inline>(4, 1)</MathJax.Node>
    </p>
    <p>
      In fact, because of the fact that we cannot reach that vector (or any
      other vector outside of that line), the we can only say that the span
      of those two vectors is the line defined by{' '}
      <MathJax.Node inline>{'(x, y): -x = y'}.</MathJax.Node>
    </p>
    <p>
      Of course, you can generalize to higher dimensions, for instance, the span
      of three vectors may be all of 3D space, or it might only be a plane
      if there was a linear dependence amongst the vectors.
    </p>
  </Section>
);

const BasisSection = () => (
  <Section title="Basis" anchor="basis">
    <p>
      Knowing that a span is the space <Strong>spanned</Strong> by a set of
      vectors, we might want to go the other way and find a set of vectors that
      describe the space. That set of vectors will be called a <Strong>basis</Strong>.
    </p>
    <p>
      Finding that set only requires that we impose two conditions we already
      know about on a set of vectors.
    </p>
    <ul>
      <li>The set of vectors must span the space we want to describe.</li>
      <li>
        The set of vectors must be linearly independent: that is to say that
        there must not be any <Strong>redundant</Strong> vectors in the set.
      </li>
    </ul>
    <p>
      With these definitions in mind, we can already make some observations
      about the basis.
    </p>
    <ul>
      <li>
        An <MathJax.Node inline>n</MathJax.Node>-dimensional space must have at
        least <MathJax.Node inline>n</MathJax.Node> vectors in its basis, such
        that it could span the entire space.
      </li>
      <li>
        An <MathJax.Node inline>n</MathJax.Node>-dimensional space must have at
        most <MathJax.Node inline>n</MathJax.Node> vectors in its basis such that
        no vector is linearly dependant on another.
      </li>
    </ul>
    <p>
      Generally speaking, if you have some <MathJax.Node inline>n</MathJax.Node>-dimensional space
      then it should always be possible to, using <MathJax.Node inline>n</MathJax.Node>{' '}
      vectors that form a basis, reach every possible point in that space with
      linear combinations of those <MathJax.Node inline>n</MathJax.Node> vectors.
    </p>
    <p>
      It should come as no surprise that in 3-dimensional space, the unit vectors
      <MathJaxMatrix inline matrix={[[1], [0], [0]]} />{' '}
      <MathJaxMatrix inline matrix={[[0], [1], [0]]} />{' '}
      <MathJaxMatrix inline matrix={[[0], [0], [1]]} />{' '}
      are a basis for the three dimensional space. It should be obvious that
      by scaling each of them by a different constant and adding them all together
      that any point in that space can be reached.
    </p>
    <Animation
      initial={{ rotation: new Euler(0.5, 0.5, 0) }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(1, 0, 0)} color={0xffff00} />
          <Vector position={new Vector3(0, 1, 0)} color={0xff00ff} />
          <Vector position={new Vector3(0, 0, 1)} color={0xffff00} />
        </Visualization>
      )}
    />
    <p>
      Because of that, we have special names for them:{' '}
      <MathJax.Node inline>\hat i</MathJax.Node>,{' '}
      <MathJax.Node inline>\hat j</MathJax.Node> and
      <MathJax.Node inline>\hat k</MathJax.Node>.
    </p>
    <p>
      The unit vectors are not the only valid basis for an n-dimensional
      space, however. Those vectors could be scaled by any amount and they
      would still be a basis, where we could combine those three to reach
      any other vector.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
        time: 0,
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;

        return (
          <Visualization width={320} height={240} rotation={state.rotation}>
            <XAxis />
            <YAxis />
            <ZAxis />
            <Vector position={new Vector3(1 + (lerp * 2), 0, 0)} color={0xffff00} />
            <Vector position={new Vector3(0, 1 + (lerp * 3), 0)} color={0xff00ff} />
            <Vector position={new Vector3(0, 0, 1 + lerp)} color={0x00ffff} />
          </Visualization>
        );
      }}
    />
    <p>
      In fact, you could imagine squeezing all of those vectors in towards
      a line and as long as they all point in different directions, it is still
      possible to combine them in such a way such that it is possible to reach
      any point in the space with them.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
        time: 0,
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;

        return (
          <Visualization width={320} height={240} rotation={state.rotation}>
            <XAxis />
            <YAxis />
            <ZAxis />
            <Vector position={new Vector3(1, lerp, lerp)} color={0xffff00} />
            <Vector position={new Vector3(lerp, 1, lerp)} color={0xff00ff} />
            <Vector position={new Vector3(lerp, lerp, 1)} color={0x00ffff} />
          </Visualization>
        );
      }}
    />
    <p>
      It makes more sense if you think about what happens to the rest of space
      if you apply the same change in the basis vectors to every other part of
      the space.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
        time: 0,
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.001,
                            state.rotation.z),
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;

        return (
          <Visualization width={320} height={240} rotation={state.rotation} >
            <Axis basis={[1, lerp, lerp]} extents={[-10, 10]} color={0xff0000} />
            <Axis basis={[lerp, 1, lerp]} extents={[-10, 10]} color={0x00ff00} />
            <Axis basis={[lerp, lerp, 1]} extents={[-10, 10]} color={0x0000ff} />
            <Vector position={new Vector3(1, lerp, lerp)} color={0xffff00} />
            <Vector position={new Vector3(lerp, 1, lerp)} color={0xff00ff} />
            <Vector position={new Vector3(lerp, lerp, 1)} color={0x00ffff} />
          </Visualization>
        );
      }}
    />
    <p>
      It is only when all of space is flattened on to a line or a plane that
      those vectors stop being a basis for the rest of the space.
    </p>
  </Section>
);

const EROSection = () => (
  <Section title="Elementary Row Operations" anchor="elementary-row-operations">
    <p>
      If we think about a matrix as a system of equations, recall that there
      are certain things that we can do to solve for the variables in that
      system of equations. For instance, if we have a system of equations
      given by:
    </p>
    <MathJax.Node>x + y = 2</MathJax.Node>
    <MathJax.Node>x - z = 1</MathJax.Node>
    <MathJax.Node>y - z = 0</MathJax.Node>
    <p>
      We could try to solve those equations either by using substition or
      by adding and subtracting scalar multiples of entire equations
      to and from each other. Or we could express the entire system as a
      matrix-vector product and try to solve for the vector in the middle:
    </p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 1, 0], [1, 0, -1], [0, 1, -1]]} />
      <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
      <MathJax.Node inline>=</MathJax.Node>
      <MathJaxMatrix inline matrix={[[2], [1], [0]]} />
    </p>
    <p>
      If you visualize the three planes in the system, you will notice that they
      intersect at a point.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={1} c={0} d={2} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={1} b={0} c={-1} d={1} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={1} c={-1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      Now, if we recall that any vector multiplied by the three standard basis
      vectors in matrix form, <MathJax.Node inline>\hat i, \hat j, \hat k</MathJax.Node>{' '}
      is just itself, it stands to reason that if add and subtract scalar multiples
      of each component to recover our basis vectors that we will eventually arrive
      at a point where we have the identity matrix multiplied by some vector
      which gives us a point, implying that the point is equal to the resultant
      vector.
    </p>
    <p>
      At every point where we apply these operations, observe what happens to
      the three planes and to the vectors defined by the columns of the matrix.
    </p>
    <p>
      First, subtract the first row from the second:
    </p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 1, 0], [0, -1, -1], [0, 1, -1]]} />
      <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
      <MathJax.Node inline>=</MathJax.Node>
      <MathJaxMatrix inline matrix={[[2], [-1], [0]]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={1} c={0} d={2} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={-1} c={-1} d={-1} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={1} c={-1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>Then, add the second row to the third</p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 1, 0], [0, -1, -1], [0, 0, -2]]} />
      <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
      <MathJax.Node inline>=</MathJax.Node>
      <MathJaxMatrix inline matrix={[[2], [-1], [-1]]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={1} c={0} d={2} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={-1} c={-1} d={-1} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={-2} d={-1} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>Now, subtract half of the third row from the second</p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 1, 0], [0, -1, 0], [0, 0, -2]]} />
      <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
      <MathJax.Node inline>=</MathJax.Node>
      <MathJaxMatrix inline matrix={[[2], ['-1 \\over 2'], [-1]]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={1} c={0} d={2} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={-1} c={0} d={-0.5} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={-2} d={-1} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>Add the second row to the first</p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 0, 0], [0, -1, 0], [0, 0, -2]]} />
      <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
      <MathJax.Node inline>=</MathJax.Node>
      <MathJaxMatrix inline matrix={[['3 \\over 2'], ['-1 \\over 2'], [-1]]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={0} c={0} d={1.5} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={-1} c={0} d={-0.5} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={-2} d={-1} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>Clean everything up by dividing the second row by -1 and the third row by -2</p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 0, 0], [0, 1, 0], [0, 0, 1]]} />
      <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
      <MathJax.Node inline>=</MathJax.Node>
      <MathJaxMatrix inline matrix={[['3 \\over 2'], ['1 \\over 2'], ['1 \\over 2']]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={0} c={0} d={1.5} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={1} c={0} d={0.5} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={1} d={0.5} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      As you will have noticed, the intersection between the planes is the point
      of the solution, but now we can simply just express that as the vector{' '}
      <MathJaxMatrix inline matrix={[['3 \\over 2'], ['1 \\over 2'], ['1 \\over 2']]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
        time: 0,
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const ilerp = 1 - lerp;

        return (
          <Visualization width={320} height={240} rotation={state.rotation}>
            <XAxis />
            <YAxis />
            <ZAxis />
            <Vector position={new Vector3(ilerp * 1.5, ilerp * 0.5, ilerp * 0.5)} color={0xffff00} />
            <Plane extents={[-2, 2]} a={1} b={0} c={0} d={1.5} color={0xffff00} transparent opacity={lerp} />
            <Plane extents={[-2, 2]} a={0} b={1} c={0} d={0.5} color={0xff00ff} transparent opacity={lerp} />
            <Plane extents={[-2, 2]} a={0} b={0} c={1} d={0.5} color={0x00ffff} transparent opacity={lerp} />
          </Visualization>
        );
      }}
    />
    <p>
      As we will see, <Strong>Elementary Row Operations</Strong> can help us solve
      all sorts of problems where we need to determine a vector that satisfies
      a given solution.
    </p>
  </Section>
);

const RowSpaceSection = () => (
  <Section title="Row Space" anchor="row-space">
    <p>
      Given what we know about spans and matrices, the row space is just the
      <Strong>span</Strong> of each of the rows, if we are to consider each
      row to be a vector in a set.
    </p>
    <p>
      Recall that the <Strong>span</Strong> is just the set of all linear
      combinations of a set of vectors, which describes the space that is
      reachable by those linear combinations.
    </p>
    <p>
      So if you have a matrix defined like this:
    </p>
    <MathJaxMatrix matrix={[[1, 1], [2, 2]]} />
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector color={0xffff00} position={new Vector3(1, 1, 0)} />
      <Vector color={0xff00ff} position={new Vector3(1, 0, 1)} />
    </BlankableVisualization>
    <p>
      Then because the rows are not linearly independent, the row space is
      just going to be the line defined by <MathJax.Node>y = -x</MathJax.Node>
    </p>
    <p>
      However, if you have a matrix defined with two linearly
      independent vectors, then the row space is going to be all 2D space.
    </p>
    <MathJaxMatrix matrix={[[1, 1], [1, -1]]} />
    <BlankableVisualization width={320} height={240}>
      <XAxis />
      <YAxis />
      <Vector color={0xffff00} position={new Vector3(1, 1, 0)} />
      <Vector color={0xff00ff} position={new Vector3(1, -1, 1)} />
    </BlankableVisualization>
    <p>
      One thing which you might be interested in is finding the basis
      for a row space. Recall that since all the vectors in a basis
      must be linearly independent, the number of vectors in the basis
      is going to tell you, at most, how many dimensions the space which
      has the transformation applied to it, is going to have.
    </p>
    <p>
      Thankfully, you do not have to do too much work to compute the
      dimension of the row space. If you can immediately tell that the
      rows are all lineraly independent from each other, then you know
      that the row-space is n-dimensional, where n is the number of
      rows in the matrix. Visually, this would mean that if you visualized
      all the rows as planes with a solution of <MathJaxMatrix matrix={[[0], [0], [0]]} inline />,
      then there would be a single point where they all intersect.
    </p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 1, 0], [1, 0, -1], [0, 1, -1]]} />
      <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
      <MathJax.Node inline>=</MathJax.Node>
      <MathJaxMatrix inline matrix={[[0], [0], [0]]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={1} c={0} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={1} b={0} c={-1} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={1} c={-1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      If you want to more rigorously prove what the dimension of the row space is,
      you can use <Strong>Elementary Row Operations</Strong> as explained above. Recall
      that since we are only interested in finding the set of all possible vectors
      spanned by the rows and that either our row space consisted of linearly independent
      vectors or linearly dependent vectors and all <Strong>Elementary Row Operations</Strong>
      actually do is recover the standard basis vectors through linear combinations, it follows
      that performing such operations are safe, in that they will not change the dimension,
      which is what we are looking for.
    </p>
    <p>
      With that mouthful out of the way, recall that the matrix above
      row-reduced to:
    </p>
    <MathJaxMatrix matrix={[[1, 0, 0], [0, 1, 0], [0, 0, 1]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={0} c={0} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={1} c={0} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      So, given that we have three vectors that are linearly independent, our
      transformation has at most three dimensions.
    </p>
    <p>
      The row space might not always have as many dimensions as the number of
      rows in the matrix. For instance, consider the matrix:
    </p>
    <MathJaxMatrix matrix={[[1, 1, 0], [2, 2, 0], [0, 0, 1]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={1} c={0} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={2} b={2} c={0} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      With this matrix, we can immediately tell that the second row has a
      linear dependence on the first (it is just a scalar multiple of it). Indeed,
      it row-reduces to:
    </p>
    <MathJaxMatrix matrix={[[1, 1, 0], [0, 0, 0], [0, 0, 1]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-2, 2]} a={1} b={1} c={0} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={0} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-2, 2]} a={0} b={0} c={1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      So in reality, the dimension of the row-space of this matrix is is just 2. It makes more sense
      if you visualize the basis vectors
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector color={0xffff00} position={new Vector3(1, 1, 0)} />
          <Vector color={0xff00ff} position={new Vector3(2, 2, 0)} />
          <Vector color={0x00ffff} position={new Vector3(0, 1, 1)} />
        </Visualization>
      )}
    />
    <p>
      The only part of space reachable by linear combinations of all three of those
      vectors is a plane.
    </p>
    <p>
      If we had a matrix with three linearly dependent rows:
    </p>
    <MathJaxMatrix matrix={[[1, 1, 0], [2, 2, 0], [3, 3, 0]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector color={0xffff00} position={new Vector3(1, 1, 0)} />
          <Vector color={0xff00ff} position={new Vector3(2, 2, 0)} />
          <Vector color={0x00ffff} position={new Vector3(3, 3, 0)} />
        </Visualization>
      )}
    />
    <p>
      Then the only thing reachable is a line, specifically the <MathJax.Node inline>x = -y</MathJax.Node>{' '}
      line.
    </p>
    <p>
      Sometimes you can get a linear dependence between the rows that is not
      as obvious as just one row being a scalar multiple of the other. For instance
      the following system has a dimension of 2. Look carefully at the diagram and
      you will see that there is not really a single point of intersection for all three
      planes. Instead, they all seem to intersect with each other along a line.
    </p>
    <MathJaxMatrix matrix={[[1, 2, 3], [2, 2, 2], [-1, 0, 1]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-1, 1]} a={1} b={2} c={3} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={2} b={2} c={2} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={-1} b={0} c={1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      See what happens when we row-reduce it. First, add the first row
      to the third:
    </p>
    <MathJaxMatrix matrix={[[1, 2, 3], [2, 2, 2], [0, 2, 4]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-1, 1]} a={1} b={2} c={3} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={2} b={2} c={2} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={0} b={2} c={4} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      Now subtract half the third row from the second:
    </p>
    <MathJaxMatrix matrix={[[1, 2, 3], [2, 1, 0], [0, 2, 4]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-1, 1]} a={1} b={2} c={3} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={2} b={1} c={0} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={0} b={2} c={4} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      Then, multiply the first row by 4 and subtract 3 times the last row from it
    </p>
    <MathJaxMatrix matrix={[[4, 2, 0], [2, 1, 0], [0, 2, 4]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-1, 1]} a={4} b={2} c={0} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={2} b={1} c={0} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={0} b={2} c={4} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      Finally, notice that the first row is twice the second. Subtract twice the second row from it.
    </p>
    <MathJaxMatrix matrix={[[0, 0, 0], [2, 1, 0], [0, 2, 4]]} />
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-1, 1]} a={0} b={0} c={0} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={2} b={1} c={0} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={0} b={2} c={4} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      The final two rows are linearly independent of each other. We can represent them
      as basis vectors to show the basis of the row space.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector color={0xff00ff} position={new Vector3(2, 1, 0)} />
          <Vector color={0x00ffff} position={new Vector3(0, 1, 2)} />
        </Visualization>
      )}
    />
    <p>
      Which, you will notice, forms a plane, indicating that our mapping space is two dimensional.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(2, 1, 0)} color={0xffff00} />
          <Vector position={new Vector3(0, 1, 2)} color={0xff00ff} />
          <Plane extents={[-1, 1]} a={2} b={-4} c={2} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
  </Section>
);

const ColumnSpaceSection = () => (
  <Section title="Column Space" anchor="column-space">
    <p>
      Like <Strong>Row Space</Strong>, we can also read off the columns of our
      matrix and try and work out the span of that set of vectors. That span is
      called the <Strong>Column Space</Strong>, since it is the space accessible
      by the span of all the columns of the matrix.
    </p>
    <p>
      The column space of a matrix tells us about the output space of the transformation -
      since each column tells us where the standard basis vectors in a similar identity matrix
      would land if they were transformed by that matrix.
    </p>
    <MathJaxMatrix matrix={[[3, 1], [1, 1]]} />
    <p>
      For instance in this matrix, the standard basis vector <MathJaxMatrix inline matrix={[[1], [0]]} />, or{' '}
      <MathJax.Node inline>\hat i</MathJax.Node> lands on <MathJaxMatrix inline matrix={[[3], [1]]} />. Similarly,
      the standard basis vector <MathJax.Node inline>\hat j</MathJax.Node> lands on{' '}
      <MathJaxMatrix inline matrix={[[1], [1]]} />.
    </p>
    <Animation
      initial={{ time: 0 }}
      update={(state) => ({
        time: state.time + 1,
      })}
      render={(state) => {
        const lerp = Math.max(Math.sin(state.time * 0.05) + 1, 0) / 2;
        const mat = new Matrix3();
        const iHat = new Vector3(1, 0, 0);
        const jHat = new Vector3(0, 1, 0);

        mat.set(1 + (2 * lerp), (1 * lerp), 0,
                lerp, 1, 0,
                0, 0, 0);

        const transformedIHat = iHat.clone().applyMatrix3(mat);
        const transformedJHat = jHat.clone().applyMatrix3(mat);

        return (
          <div>
            <Visualization width={320} height={240}>
              <XAxis />
              <YAxis />
              <Vector position={transformedIHat} color={0xffff00} />
              <Vector position={transformedJHat} color={0xffff00} />
            </Visualization>
          </div>
        );
      }}
    />
    <p>
      Now, just like the row space, we might want to work out a basis for the column
      space. We can either do that by looking at the columns themselves to see
      if there are obvious dependencies, or we can try and recover a set of vectors
      each having their own leading entry.
    </p>
    <p>
      However, we <Strong>cannot</Strong> do this with row operations. We are examining
      the set of column vectors for linear dependence, so applying row operations will
      effectively change a single component of each column, as opposed to all components
      of that column. Such an operation will fundamentally change the nature of the resultant
      space.
    </p>
    <p>
      As a trick, we can use row-reduction if we find a way to express the columns of the
      matrix as rows, temporarily. We can do that with the transpose, <MathJax.Node inline>A^T</MathJax.Node>
    </p>
    <p>
      In general, the transpose rearranges the matrix such that the first row becomes
      the first column, the second row becomes the second column and so on. As such, transpose
      of an <MathJax.Node inline>m \times n</MathJax.Node> matrix will be an{' '}
      <MathJax.Node inline>n \times m</MathJax.Node> matrix.
    </p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 2, 3], [1, 1, 3], [2, 1, 6]]} />
      <MathJax.Node inline>\rightarrow</MathJax.Node>
      <MathJaxMatrix inline matrix={[[1, 1, 2], [2, 1, 1], [3, 3, 6]]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-1, 1]} a={1} b={1} c={2} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={1} b={1} c={3} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={2} b={1} c={6} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      Now we can row-reduce as usual:
    </p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 1, 2], [2, 1, 1], [3, 3, 6]]} />
      {'~'}
      <MathJaxMatrix inline matrix={[[-1, 0, 1], [0, 1, 3], [0, 0, 0]]} />
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Plane extents={[-1, 1]} a={-1} b={0} c={1} d={0} color={0xffff00} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={0} b={1} c={3} d={0} color={0xff00ff} transparent opacity={0.8} />
          <Plane extents={[-1, 1]} a={0} b={0} c={0} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      Transposing our row-reduced matrix, we get a new matrix with our column space.
    </p>
    <p>
      <MathJaxMatrix inline matrix={[[-1, 0, 1], [0, 1, 3], [0, 0, 0]]} />
      <MathJax.Node inline>\rightarrow</MathJax.Node>
      <MathJaxMatrix inline matrix={[[-1, 0, 0], [0, 1, 0], [1, 3, 0]]} />
    </p>
    <p>
      So our column space here comprises of the vectors <MathJaxMatrix inline matrix={[[-1], [0], [1]]} />{' '}
      and <MathJaxMatrix inline matrix={[[0], [1], [3]]} />{' '}
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(-1, 0, 0)} color={0xff00ff} />
          <Vector position={new Vector3(0, 1, 3)} color={0xffff00} />
        </Visualization>
      )}
    />
    <p>
      Which, you will notice, forms a plane, indicating that our output space is two dimensional.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(-1, 0, 0)} color={0xffff00} />
          <Vector position={new Vector3(0, 1, 3)} color={0xff00ff} />
          <Plane extents={[-1, 1]} a={0} b={-3} c={1} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
  </Section>
);

const NullSpaceSection = () => (
  <Section title="Null Space" anchor="Null Space">
    <p>
      Like Row Space and Column Space, <Strong>Null Space</Strong> is another fundamental
      space in a matrix, being the set of all vectors which end up as zero when the transformation
      is applied to them.
    </p>
    <p>
      In cases where the transformation does not flatten all of space into a lower dimension,
      the null space will just contain the zero vector, since the only thing that can get transformed
      to zero is the zero vector itself.
    </p>
    <p>
      In other cases, there is an interesting compliment going on between both the
      <Strong>Column Space</Strong>, the <Strong>Row Space</Strong> and the{' '}
      <Strong>Null Space</Strong>.
    </p>
    <p>
      Consider the same case above where space was squished on to a plane.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(2, 1, 0)} color={0xffff00} />
          <Vector position={new Vector3(0, 1, 2)} color={0xff00ff} />
          <Plane extents={[-1, 1]} a={2} b={-4} c={2} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>
      You can imagine that on every point of this plane, there was once a whole line full of vectors
      sticking out perpendicular to the plane that got squashed down to a single point. But there is a
      special line sticking out from the origin of all vectors that got squashed down on to the origin,
      or the zero vector. In this case, that line is the set of all vectors that ended up on the
      zero vector under the transformation, so it <Strong>is</Strong> the Null Space.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(-1, 2, -1)} color={0xffff00} />
          <Vector position={new Vector3(1, -2, 1)} color={0xffff00} />
          <Plane extents={[-1, 1]} a={2} b={-4} c={2} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
    <p>(Astute readers might instantly recognize that this line is the surface normal to the plane in both directions)</p>
    <p>
      Now on to actually computing the Null Space. What we are after is a solution to the
      system of equations, some valid values for <MathJax.Node inline>x, y, z</MathJax.Node>,
      such that any linear combination of the vector made up of <MathJax.Node inline>x, y, z</MathJax.Node>{' '}
      gets squished down to the zero vector.
    </p>
    <p>
      To do that, we can just use <Strong>Elementary Row Operations</Strong> to get the matrix into
      a form that is a little easier to work with, and then try and solve for those values from there.
    </p>
    <p>Now, recall that our original matrix row-reduces as follows:</p>
    <p>
      <MathJaxMatrix inline matrix={[[1, 2, 3], [2, 2, 2], [-1, 0, 1]]} />
      {'~'}
      <MathJaxMatrix inline matrix={[[0, 0, 0], [2, 1, 0], [0, 2, 4]]} />
    </p>
    <p>
      And recall that we are trying to solve the system when the result is the zero vector
    </p>
    <MathJaxMatrix inline matrix={[[0, 0, 0], [2, 1, 0], [0, 2, 4]]} />
    <MathJaxMatrix inline matrix={[['x'], ['y'], ['z']]} />
    <MathJaxMatrix inline matrix={[[0], [0], [0]]} />
    <p>
      Now, how do we solve for <MathJax.Node inline>x, y, z</MathJax.Node>, from here?
      One thing to pay attention to are what we call <Strong>basic variables</Strong>
      and <Strong>free variables</Strong>. A basic variable has a leading entry, whereas
      a free variable does not.
    </p>
    <p>
      So in this case, our basic variables are <MathJax.Node inline>x</MathJax.Node> and
      <MathJax.Node inline>y</MathJax.Node> since we have a 2 in the first column of
      the second row and a 2 in the second column of the third row.
      <MathJax.Node inline>z</MathJax.Node> is not a leading column, so it is
      a <Strong>free variable</Strong>.
    </p>
    <p>
      In order to solve the system, we can rephrase the two basic variables in
      terms of the free variable:
    </p>
    <MathJax.Node>
      2y + 4z = 0
    </MathJax.Node>
    <MathJax.Node>
      y = -2z
    </MathJax.Node>
    <p>And solving for x...</p>
    <MathJax.Node>
      2x + y = 0
    </MathJax.Node>
    <MathJax.Node>
      2x - 2z = 0
    </MathJax.Node>
    <MathJax.Node>
      -2z = -2x
    </MathJax.Node>
    <MathJax.Node>
      x = z
    </MathJax.Node>
    <p>
      Now that we have a solution for <MathJax.Node inline>x, y</MathJax.Node> in terms
      of <MathJax.Node inline>z</MathJax.Node>, we can express it as a vector
      like this:
    </p>
    <MathJaxMatrix matrix={[['z'], ['-2z'], ['z']]} />
    <p>
      Or more specifically:
    </p>
    <MathJaxMatrix inline matrix={[[1], [-2], [1]]} />
    <MathJax.Node inline>z</MathJax.Node>
    <p>
      Thus, the vector <MathJaxMatrix inline matrix={[[1], [-2], [1]]} /> is the
      basis for the <Strong>Null Space</Strong> of the transformation. You will also
      notice that this is the exact same vector we found earlier as the
      normal vector to the plane.
    </p>
    <Animation
      initial={{
        rotation: new Euler(0.5, 0.5, 0),
      }}
      update={(state) => ({
        rotation: new Euler(state.rotation.x,
                            state.rotation.y + 0.004,
                            state.rotation.z),
      })}
      render={(state) => (
        <Visualization width={320} height={240} rotation={state.rotation}>
          <XAxis />
          <YAxis />
          <ZAxis />
          <Vector position={new Vector3(1, -2, 1)} color={0xffff00} />
          <Plane extents={[-1, 1]} a={2} b={-4} c={2} d={0} color={0x00ffff} transparent opacity={0.8} />
        </Visualization>
      )}
    />
  </Section>
);

export class LinearAlgebraPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <article>
        <Helmet>
          <title>Linear Algebra</title>
          <meta name="description" content="A primer on linear algebra" />
        </Helmet>
        <div>
          <MathJax.Context>
            <div>
              <SpacesSection />
              <VectorsSection />
              <MatricesSection />
              <LinearIndependenceSection />
              <SubspacesSection />
              <SpansSection />
              <BasisSection />
              <EROSection />
              <RowSpaceSection />
              <ColumnSpaceSection />
              <NullSpaceSection />
            </div>
          </MathJax.Context>
        </div>
      </article>
    );
  }
}

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps, null);

const withReducer = injectReducer({ key: 'linear-algebra', reducer });

export default compose(
  withReducer,
  withConnect,
)(LinearAlgebraPage);
