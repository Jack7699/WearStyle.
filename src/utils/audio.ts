// Web Audio API generator for sleek tactile streetwear audio effects & ambient store vibe
class StreetwearAudioEngine {
  private ctx: AudioContext | null = null;
  public isSoundEnabled: boolean = false;
  public isVibePlaying: boolean = false;
  private vibeOsc: OscillatorNode | null = null;
  private vibeGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (this.isSoundEnabled) {
      this.initCtx();
      this.playClick();
    } else {
      this.stopVibe();
    }
    return this.isSoundEnabled;
  }

  public playClick() {
    if (!this.isSoundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio playback safety catch
    }
  }

  public playAddToCart() {
    if (!this.isSoundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 2-tone melodic streetwear chirp
      const notes = [440, 660, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.06, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.12);
      });
    } catch {
      // Audio safety
    }
  }

  public toggleAmbientVibe(): boolean {
    if (!this.isSoundEnabled) {
      this.toggleSound();
    }
    if (this.isVibePlaying) {
      this.stopVibe();
      return false;
    } else {
      this.startVibe();
      return true;
    }
  }

  private startVibe() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.stopVibe();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now); // Warm sub-A note

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 2); // Soft swell

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.vibeOsc = osc;
      this.vibeGain = gain;
      this.isVibePlaying = true;
    } catch {
      // Safe
    }
  }

  private stopVibe() {
    if (this.vibeOsc) {
      try {
        this.vibeOsc.stop();
        this.vibeOsc.disconnect();
      } catch {}
      this.vibeOsc = null;
    }
    this.isVibePlaying = false;
  }
}

export const soundEngine = new StreetwearAudioEngine();
