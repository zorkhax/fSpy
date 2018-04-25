import * as React from 'react';
import HorizonControl from './../components/horizon-control'
import OriginControl from './../components/origin-control'
import PrincipalPointControl from './../components/principal-point-control'
import { CalibrationMode, StoreState, ControlPointsState1VP, ControlPointsState2VP, ControlPointsStateBase, Point2D } from '../types/store-state';
import { AppAction, setHorizonStartPosition, setHorizonEndPosition } from '../actions';
import { Dispatch, connect } from 'react-redux';

export interface ControlPointsContainerOwnProps {
  left: number
  top: number
  width: number
  height: number
}

export interface ControlPointsContainerProps {
  calibrationMode: CalibrationMode
  controlPointsState1VP: ControlPointsState1VP
  controlPointsState2VP: ControlPointsState2VP

  onPrincipalPointDrag(is1VPMode: boolean, position:Point2D): void
  onOriginDrag(is1VPMode: boolean, position:Point2D): void

  onHorizonStartDrag(is1VPMode: boolean, position:Point2D): void
  onHorizonEndDrag(is1VPMode: boolean, position:Point2D): void
}

export class ControlPointsContainer extends React.PureComponent<ControlPointsContainerProps & ControlPointsContainerOwnProps> {
  render() {
    let svgStyle: React.CSSProperties = {
      top: this.props.top,
      left: this.props.left,
      width: this.props.width,
      height: this.props.height,
      position: "absolute"
    }
    let is1VPMode = this.props.calibrationMode == CalibrationMode.OneVanishingPoint

    return (
      <svg style={svgStyle}>
        {this.renderCommonControls(is1VPMode ? this.props.controlPointsState1VP : this.props.controlPointsState2VP)}
        {is1VPMode ? this.render1VPControls() : this.render2VPControls()}
      </svg>
    )
  }

  private renderCommonControls(state: ControlPointsStateBase) {
    return (
      <g>
        <PrincipalPointControl
          position={this.rel2Abs(state.principalPoint)}
          dragCallback={(position:Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onPrincipalPointDrag)
          }}
        />
        <OriginControl
          position={this.rel2Abs(state.origin)}
          dragCallback={(position:Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onOriginDrag)
          }}
        />
      </g>
    )
  }

  private render1VPControls() {
    return (
      <g>
        <HorizonControl
          start={ this.rel2Abs(this.props.controlPointsState1VP.horizonStart) }
          end={ this.rel2Abs(this.props.controlPointsState1VP.horizonEnd) }
          enabled={true}
          startDragCallback={(position:Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onHorizonStartDrag)
          }}
          endDragCallback={(position:Point2D) => {
            this.invokeDragCallback(this.is1VPMode, position, this.props.onHorizonEndDrag)
          }}
        />
      </g>
    )
  }

  private render2VPControls() {
    return (
      <g>


      </g>
    )
  }

  private get is1VPMode():boolean {
    return this.props.calibrationMode == CalibrationMode.OneVanishingPoint
  }

  private abs2Rel(abs:Point2D):Point2D {
    return {
      x: abs.x / this.props.width,
      y: abs.y / this.props.height
    }
  }

  private rel2Abs(rel:Point2D):Point2D {
    return {
      x: rel.x * this.props.width,
      y: rel.y * this.props.height
    }
  }

  private invokeDragCallback(is1VPMode: boolean, position:Point2D, callback: (is1VPMode: boolean, position:Point2D) => void) {
    callback(
      is1VPMode,
      this.abs2Rel(position)
    )
  }
}

export function mapStateToProps(state: StoreState, ownProps: ControlPointsContainerOwnProps) {
  let result = {
    controlPointsState1VP: state.controlPointsStates.controlPointsState1VP,
    controlPointsState2VP: state.controlPointsStates.controlPointsState2VP,
    calibrationMode: state.calibrationMode
  }
  return result
}

export function mapDispatchToProps(dispatch: Dispatch<AppAction>) {
  return {
    onPrincipalPointDrag: (is1VPMode: boolean, position:Point2D) => {
      console.log("onPrincipalPointDrag")
    },
    onOriginDrag: (is1VPMode: boolean, position:Point2D) => {
      console.log("onOriginDrag")
    },
    onHorizonStartDrag: (is1VPMode: boolean, position:Point2D) => {
      dispatch(setHorizonStartPosition(position))
    },
    onHorizonEndDrag: (is1VPMode: boolean, position:Point2D) => {
      dispatch(setHorizonEndPosition(position))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPointsContainer);
