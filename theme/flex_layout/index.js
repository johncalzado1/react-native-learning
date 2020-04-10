import React from 'react';
import { View } from 'react-native'

export const FlexContainer = ({
    children,
    direction = 'column',
    justifyContent = 'flex-start',
    alignItems = 'flex-start',
    wrap = "nowrap"
}) => {
    return (
        <View style={{
            display: "flex",
            justifyContent: justifyContent,
            alignItems: alignItems,
            flexDirection: direction,
            flexWrap: wrap
        }}>{children}</View>
    )
}


export const FlexItem = ({
    children,
    grow = false,
    margin = { margin: 0 }
}) => {

    return (
        <View
            style={{
                flex: (grow === true) ? 1 : 0,
                ...margin
            }}>
            {children}
        </View >
    )
}

export const FlexItemOld = ({
    children,
    justifyContent = 'flex-start',
    alignItems = 'flex-start',
    direction = 'column',
    position = 'left',
    wrap = 'wrap',
    grow = false,
    shrink = false,
    maxWidth = 'auto',
    minWidth = 'auto',
    noMargin = false,
}) => {
    let marginLeft = 'auto';
    let marginRight = 'auto';
    let marginTop = 'auto';
    let marginBottom = 'auto';
    grow = (grow === true) ? 1 : 0;
    shrink = (shrink === true) ? 1 : 0;
    switch (position) {
        case 'left':
            marginLeft = 0;
            break;
        case 'right':
            marginRight = 0;
            break;
        case 'top':
            marginTop = 0;
            break;
        case 'bottom':
            marginBottom = 0;
            break;
    }

    if (noMargin === true) {
        marginTop = 0;
        marginBottom = 0;
        marginLeft = 0;
        marginRight = 0;
    }

    return (
        <View style={{
            flexShrink: shrink,
            display: 'flex',
            flexWrap: wrap,
            flex: grow,
            justifyContent: justifyContent,
            alignItems: alignItems,
            flexDirection: direction,
            marginTop: marginTop,
            marginBottom: marginBottom,
            marginLeft: marginLeft,
            marginRight: marginRight,
            maxWidth: maxWidth,
            minWidth: minWidth
        }}>
            {children}
        </View >
    )
}
