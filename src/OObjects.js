import React from 'react';

import { OObject } from 'monkey-typescript';

// OBoolean
// OInteger
// OFloat
// ONull
// ReturnValue
// OError
// OFunction
// OString
// OComment
// Builtin
// OArray
// HashPair
// OHash

export function OObjectComponent(props) {
  return <span className={'token ' + props.object.Type()}>{props.object.Inspect()}</span>;
}

export function OBoolean(props) {
  return <span className="token boolean">{props.value}</span>;
}
export function OInteger(props) {
  return <span className="token number">{props.value}</span>;
}
export function OFloat(props) {
  return <span className="token number">{props.value}</span>;
}
export function ONull(props) {
  return <span className="token keyword">{props.value}</span>;
}
export function OString(props) {
  return <span className="token string">{props.value}</span>;
}
export function OComment(props) {
  return <span className="token comment">{props.value}</span>;
}
export function OArray(props) {
  return <span className="token array">{props.value}</span>;
}
export function OHash(props) {
  return <span className="token hash">{props.value}</span>;
}
