import HelloWorld from '../HelloWorld.vue';
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } });
    expect(wrapper.text()).toContain('Hello Vitest');
  });
});
