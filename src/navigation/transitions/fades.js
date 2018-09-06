export const FadeScreenTransition = (index, position) => {
  const sceneRange = [index - 1, index];
  const outputOpacity = [0, 1];
  const transition = position.interpolate({
    inputRange: sceneRange,
    outputRange: outputOpacity
  });
  return {
    opacity: transition
  };
};

// TODO: DimFadeInTransition and DimFadeOutTransition (black dim)
