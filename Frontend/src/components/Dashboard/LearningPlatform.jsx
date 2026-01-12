import React, { useState } from 'react';
import LearningHub from './LearningHub';
import { TopicDetailPage } from './TopicDetailPage';
import { ModuleContentPage } from './ModuleContentPage';

export default function LearningPlatform() {
  const [currentView, setCurrentView] = useState('hub');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const navigateToTopic = (topicId) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic');
    window.scrollTo(0, 0);
  };

  const navigateToModule = (moduleId, topicId) => {
    setSelectedModuleId(moduleId);
    if (topicId) setSelectedTopicId(topicId);
    setCurrentView('module');
    window.scrollTo(0, 0);
  };

  const navigateToHub = () => {
    setCurrentView('hub');
    setSelectedTopicId(null);
    setSelectedModuleId(null);
    window.scrollTo(0, 0);
  };

  const navigateBackToTopic = () => {
    setCurrentView('topic');
    setSelectedModuleId(null);
    window.scrollTo(0, 0);
  };

  if (currentView === 'hub') {
    return <LearningHub onTopicSelect={navigateToTopic} />;
  }

  if (currentView === 'topic') {
    return (
      <TopicDetailPage
        topicId={selectedTopicId}
        onModuleSelect={navigateToModule}
        onBack={navigateToHub}
      />
    );
  }

  return (
    <ModuleContentPage
      moduleId={selectedModuleId}
      topicId={selectedTopicId}
      onBack={navigateBackToTopic}
      onModuleChange={navigateToModule}
    />
  );
}