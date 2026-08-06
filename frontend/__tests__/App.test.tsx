/**
 * @format
 */

import 'react-native';
import React from 'react';
import {it, jest} from '@jest/globals';
import renderer from 'react-test-renderer';

jest.mock('react-native-webrtc', () => {
  class MockMediaStream {
    toURL() {
      return 'mock-stream';
    }

    getTracks() {
      return [];
    }

    getVideoTracks() {
      return [];
    }
  }

  class MockPeerConnection {
    addTrack() {}
    addEventListener() {}
    close() {}
    async createOffer() {
      return {};
    }
    async createAnswer() {
      return {};
    }
    async setLocalDescription() {}
    async setRemoteDescription() {}
    async addIceCandidate() {}
  }

  return {
    MediaStream: MockMediaStream,
    RTCPeerConnection: MockPeerConnection,
    RTCIceCandidate: jest.fn(),
    RTCSessionDescription: jest.fn(),
    RTCView: 'RTCView',
    mediaDevices: {
      getUserMedia: async () => new MockMediaStream(),
    },
  };
});

import App from '../App';

it('renders correctly', async () => {
  await renderer.act(async () => {
    renderer.create(<App />);
    await Promise.resolve();
  });
});
