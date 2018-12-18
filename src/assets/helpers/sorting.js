// Sort alphabetically by locale

// Topics
const sortTopicsAlpha = (t1, t2) => t1.lowercase_name.localeCompare(t2.lowercase_name);

export const addTopicToOrderArrayAlpha = (order, allTopics, topic) => {
  const copyOrder = [...order];
  for (let i = 0; i < copyOrder.length; i++) {
    const currTopicID = copyOrder[i];
    const val = sortTopicsAlpha(allTopics[currTopicID], topic);
    if (val === 1) {
      copyOrder.splice(i, 0, topic.id);
      break;
    }
  }
  if (copyOrder.length === order.length) {
    copyOrder.push(topic.id);
  }
  return copyOrder;
};
