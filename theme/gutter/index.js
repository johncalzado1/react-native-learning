import React from 'react';
import { View } from 'react-native';

export const Gutter = ({
    children,
    margin
}) => {
    const _margin = margin || 5;
    return (
        <View style={{
            margin: _margin
        }}>
            {children}
        </View>
    )
}