import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARIA Engine | boredfolio",
  description:
    "A fully autonomous content engine for X. Researches trends, writes original tweets, posts them, replies to itself for algorithmic boost, tracks performance, and self-heals. Zero human intervention.",
  openGraph: {
    title: "ARIA Engine",
    description:
      "Fully autonomous content engine for X. Claude Opus writes everything. Zero manual intervention.",
    type: "website",
  },
};

export default function AriaPage() {
  return (
    <div
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#0d1117",
        color: "#e6edf3",
        minHeight: "100vh",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
body { margin: 0; padding: 0; background: #0d1117; }
.aria-wrap { max-width: 880px; margin: 0 auto; padding: 56px 28px 40px; }

/* Hero */
.aria-hero { text-align: center; margin-bottom: 64px; }
.aria-hero h1 { font-size: 42px; font-weight: 700; letter-spacing: -1.5px; margin-bottom: 12px; color: #e6edf3; }
.aria-hero h1 em { font-style: normal; color: #3fb950; }
.aria-hero p { font-size: 16px; color: #8b949e; line-height: 1.7; max-width: 560px; margin: 0 auto 24px; }
.aria-pills { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
.aria-pill { font-size: 11px; padding: 5px 14px; border-radius: 20px; font-weight: 500; }
.aria-pg { background: rgba(63,185,80,.12); color: #3fb950; border: 1px solid rgba(63,185,80,.25); }
.aria-pb { background: rgba(88,166,255,.12); color: #58a6ff; border: 1px solid rgba(88,166,255,.25); }
.aria-pp { background: rgba(188,140,255,.12); color: #bc8cff; border: 1px solid rgba(188,140,255,.25); }

/* Section titles */
.aria-st { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #3fb950; font-weight: 600; margin-bottom: 6px; }
.aria-sh { font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 8px; color: #e6edf3; }
.aria-sp { font-size: 14px; color: #8b949e; line-height: 1.6; margin-bottom: 32px; max-width: 640px; }
.aria-sec { margin-bottom: 64px; }

/* Pipeline steps */
.aria-pipe { display: flex; flex-direction: column; gap: 0; }
.aria-step { display: grid; grid-template-columns: 56px 1fr; gap: 0; }
.aria-step-num { display: flex; flex-direction: column; align-items: center; }
.aria-num { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; font-family: 'SF Mono', monospace; flex-shrink: 0; }
.aria-line { width: 2px; flex: 1; min-height: 20px; }
.aria-step-body { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 18px 22px; margin-bottom: 12px; }
.aria-step-body h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.aria-step-body p { font-size: 13px; color: #8b949e; line-height: 1.55; }
.aria-who { font-size: 11px; margin-top: 8px; padding: 3px 10px; border-radius: 8px; display: inline-block; font-weight: 500; }

.aria-c-green .aria-num { background: rgba(63,185,80,.15); color: #3fb950; border: 1px solid rgba(63,185,80,.3); }
.aria-c-green .aria-line { background: rgba(63,185,80,.2); }
.aria-c-green h3 { color: #3fb950; }
.aria-c-blue .aria-num { background: rgba(88,166,255,.15); color: #58a6ff; border: 1px solid rgba(88,166,255,.3); }
.aria-c-blue .aria-line { background: rgba(88,166,255,.2); }
.aria-c-blue h3 { color: #58a6ff; }
.aria-c-purple .aria-num { background: rgba(188,140,255,.15); color: #bc8cff; border: 1px solid rgba(188,140,255,.3); }
.aria-c-purple .aria-line { background: rgba(188,140,255,.2); }
.aria-c-purple h3 { color: #bc8cff; }
.aria-c-cyan .aria-num { background: rgba(57,210,192,.15); color: #39d2c0; border: 1px solid rgba(57,210,192,.3); }
.aria-c-cyan .aria-line { background: rgba(57,210,192,.2); }
.aria-c-cyan h3 { color: #39d2c0; }
.aria-c-orange .aria-num { background: rgba(210,153,34,.15); color: #d29922; border: 1px solid rgba(210,153,34,.3); }
.aria-c-orange .aria-line { background: rgba(210,153,34,.2); }
.aria-c-orange h3 { color: #d29922; }
.aria-c-pink .aria-num { background: rgba(247,120,186,.15); color: #f778ba; border: 1px solid rgba(247,120,186,.3); }
.aria-c-pink .aria-line { background: rgba(247,120,186,.2); }
.aria-c-pink h3 { color: #f778ba; }
.aria-w-purple { background: rgba(188,140,255,.1); color: #bc8cff; }
.aria-w-green { background: rgba(63,185,80,.1); color: #3fb950; }

/* 3 columns */
.aria-cols3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.aria-card { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 24px 20px; text-align: center; }
.aria-card-icon { font-size: 28px; margin-bottom: 10px; }
.aria-card h3 { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
.aria-card .aria-sub { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #484f58; margin-bottom: 14px; }
.aria-card ul { list-style: none; text-align: left; font-size: 12px; color: #8b949e; padding: 0; }
.aria-card li { padding: 5px 0; border-bottom: 1px solid rgba(48,54,61,.5); }
.aria-card li:last-child { border: none; }

/* Stats */
.aria-stats4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.aria-stat { background: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 18px; text-align: center; }
.aria-sv { font-size: 28px; font-weight: 600; font-family: 'SF Mono', monospace; }
.aria-sl { font-size: 10px; color: #8b949e; text-transform: uppercase; letter-spacing: .5px; margin-top: 4px; }

/* Footer */
.aria-foot { text-align: center; padding: 24px 0; margin-top: 40px; border-top: 1px solid #30363d; }
.aria-foot a { color: #3fb950; text-decoration: none; font-size: 13px; }

/* Responsive */
@media (max-width: 640px) {
  .aria-cols3 { grid-template-columns: 1fr; }
  .aria-stats4 { grid-template-columns: repeat(2, 1fr); }
  .aria-hero h1 { font-size: 32px; }
  .aria-sh { font-size: 20px; }
}
`,
        }}
      />

      <div className="aria-wrap">
        {/* HERO */}
        <div className="aria-hero">
          <h1>
            ARIA <em>Engine</em>
          </h1>
          <p>
            A fully autonomous content engine for X. It researches trends,
            writes original tweets in a consistent voice, posts them, replies to
            itself for algorithmic boost, tracks performance, and self-heals when
            things break. No human touches the keyboard after deployment.
          </p>
          <div className="aria-pills">
            <span className="aria-pill aria-pg">zero intervention</span>
            <span className="aria-pill aria-pb">
              claude opus writes everything
            </span>
            <span className="aria-pill aria-pp">
              anti-bot detection built in
            </span>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="aria-sec">
          <div className="aria-st">How it works</div>
          <div className="aria-sh">
            One engine. Six steps. Every 20 minutes.
          </div>
          <p className="aria-sp">
            A single script wakes up every 20 minutes. It walks through six
            steps in order. Each step checks if there&apos;s work to do. If not,
            it skips instantly. If yes, it acts.
          </p>

          <div className="aria-pipe">
            <div className="aria-step aria-c-green">
              <div className="aria-step-num">
                <div className="aria-num">1</div>
                <div className="aria-line"></div>
              </div>
              <div className="aria-step-body">
                <h3>Research</h3>
                <p>
                  Reads 8 RSS feeds (Anthropic, OpenAI, Hacker News,
                  Lenny&apos;s Newsletter, Jason Fried, etc.) for what the tech
                  world is talking about right now. This gives tweets topical
                  awareness without being reactions.
                </p>
              </div>
            </div>

            <div className="aria-step aria-c-blue">
              <div className="aria-step-num">
                <div className="aria-num">2</div>
                <div className="aria-line"></div>
              </div>
              <div className="aria-step-body">
                <h3>Write</h3>
                <p>
                  If less than 3 tweets are ready in the queue, asks Claude Opus
                  to write 4 new ones across different topic territories
                  (building, organizations, AI, taste). Claude also rates each
                  tweet on how likely it is to get replies, bookmarks, and stop
                  the scroll.
                </p>
                <span className="aria-who aria-w-purple">Claude Opus</span>
              </div>
            </div>

            <div className="aria-step aria-c-purple">
              <div className="aria-step-num">
                <div className="aria-num">3</div>
                <div className="aria-line"></div>
              </div>
              <div className="aria-step-body">
                <h3>Post</h3>
                <p>
                  Picks the highest-scored tweet from the queue. Checks three
                  gates: is it the right time of day in India? Has it been at
                  least 2 hours since the last post? Is the queue not empty? If
                  all pass, it posts via browser automation.
                </p>
                <span className="aria-who aria-w-green">CDP Browser</span>
              </div>
            </div>

            <div className="aria-step aria-c-cyan">
              <div className="aria-step-num">
                <div className="aria-num">4</div>
                <div className="aria-line"></div>
              </div>
              <div className="aria-step-body">
                <h3>Self-Reply</h3>
                <p>
                  Within 2-5 minutes of posting, Claude writes a second-angle
                  reply to the original tweet. This triggers X&apos;s algorithm
                  to boost the post (the &quot;author replied&quot; signal is
                  weighted 150x by X&apos;s ranking system).
                </p>
                <span className="aria-who aria-w-purple">Claude Opus</span>
              </div>
            </div>

            <div className="aria-step aria-c-orange">
              <div className="aria-step-num">
                <div className="aria-num">5</div>
                <div className="aria-line"></div>
              </div>
              <div className="aria-step-body">
                <h3>Measure</h3>
                <p>
                  Every 4 hours, navigates to the X profile and reads
                  impressions, likes, replies, retweets, and bookmarks for each
                  live tweet. This data feeds back into the system so it learns
                  what works.
                </p>
                <span className="aria-who aria-w-green">CDP Browser</span>
              </div>
            </div>

            <div className="aria-step aria-c-pink">
              <div className="aria-step-num">
                <div className="aria-num">6</div>
                <div className="aria-line"></div>
              </div>
              <div className="aria-step-body">
                <h3>Self-Heal</h3>
                <p>
                  Every cycle checks if the browser, the AI models, and the
                  posting system are alive. If something is down, it tries to
                  restart it. If 3 posts fail in a row, it sends a Telegram
                  alert. Logs auto-rotate. Stale content auto-expires.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* THREE LAYERS */}
        <div className="aria-sec">
          <div className="aria-st">Architecture</div>
          <div className="aria-sh">Brain. Muscle. Hands.</div>
          <p className="aria-sp">
            Three layers with strict separation. The brain never touches the
            browser. The hands never make creative decisions.
          </p>

          <div className="aria-cols3">
            <div
              className="aria-card"
              style={{ borderColor: "rgba(188,140,255,.3)" }}
            >
              <div className="aria-card-icon" style={{ color: "#bc8cff" }}>
                &#9672;
              </div>
              <h3 style={{ color: "#bc8cff" }}>Claude Opus</h3>
              <div className="aria-sub">The Brain</div>
              <ul>
                <li>Writes all tweet content</li>
                <li>Scores quality and virality</li>
                <li>Generates self-replies in voice</li>
                <li>All creative decisions</li>
              </ul>
            </div>
            <div
              className="aria-card"
              style={{ borderColor: "rgba(210,153,34,.3)" }}
            >
              <div className="aria-card-icon" style={{ color: "#d29922" }}>
                &#9881;
              </div>
              <h3 style={{ color: "#d29922" }}>Gemma 4</h3>
              <div className="aria-sub">The Muscle</div>
              <ul>
                <li>Runs locally, not cloud</li>
                <li>Backup numeric scoring</li>
                <li>Zero creative authority</li>
                <li>Fast, cheap, disposable</li>
              </ul>
            </div>
            <div
              className="aria-card"
              style={{ borderColor: "rgba(63,185,80,.3)" }}
            >
              <div className="aria-card-icon" style={{ color: "#3fb950" }}>
                &#9741;
              </div>
              <h3 style={{ color: "#3fb950" }}>CDP Chrome</h3>
              <div className="aria-sub">The Hands</div>
              <ul>
                <li>Posts tweets via browser</li>
                <li>Scrapes own analytics</li>
                <li>Posts self-replies</li>
                <li>No decision-making</li>
              </ul>
            </div>
          </div>
        </div>

        {/* VOICE CONTROL */}
        <div className="aria-sec">
          <div className="aria-st">Voice Control</div>
          <div className="aria-sh">
            11 golden tweets define the entire personality.
          </div>
          <p className="aria-sp">
            Every generated tweet is measured against 11 hand-picked examples
            that define tone, structure, and energy. 25+ words are permanently
            banned to prevent AI-sounding output (no &quot;delve&quot;, no
            &quot;landscape&quot;, no hashtags, forced lowercase). Four content
            territories are weighted to control the topic mix.
          </p>

          <div className="aria-stats4">
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#3fb950" }}>
                4
              </div>
              <div className="aria-sl">territories</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#58a6ff" }}>
                11
              </div>
              <div className="aria-sl">golden tweets</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#bc8cff" }}>
                25+
              </div>
              <div className="aria-sl">banned words</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#39d2c0" }}>
                280
              </div>
              <div className="aria-sl">max chars</div>
            </div>
          </div>
        </div>

        {/* SAFETY */}
        <div className="aria-sec">
          <div className="aria-st">Safety</div>
          <div className="aria-sh">
            Designed to be undetectable as automated.
          </div>
          <p className="aria-sp">
            Every action has randomized timing. No two cycles produce the same
            pattern. The system posts 4-6 tweets per day during natural Indian
            hours, with human-like pauses before every browser interaction.
          </p>

          <div className="aria-stats4">
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#d29922" }}>
                30s-5m
              </div>
              <div className="aria-sl">startup jitter</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#d29922" }}>
                30s-3m
              </div>
              <div className="aria-sl">pre-post delay</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#d29922" }}>
                2h+
              </div>
              <div className="aria-sl">min gap</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#d29922" }}>
                4-6
              </div>
              <div className="aria-sl">posts / day</div>
            </div>
          </div>
        </div>

        {/* BY THE NUMBERS */}
        <div className="aria-sec">
          <div className="aria-st">By the numbers</div>
          <div className="aria-sh">The full system.</div>
          <div className="aria-stats4" style={{ marginTop: 20 }}>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#3fb950" }}>
                1
              </div>
              <div className="aria-sl">script</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#58a6ff" }}>
                1
              </div>
              <div className="aria-sl">cron job</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#bc8cff" }}>
                6
              </div>
              <div className="aria-sl">phases / cycle</div>
            </div>
            <div className="aria-stat">
              <div className="aria-sv" style={{ color: "#39d2c0" }}>
                ~90s
              </div>
              <div className="aria-sl">to write 4 tweets</div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="aria-foot">
          <a href="https://github.com/balabommablock-cpu/aria-engine">
            View Source on GitHub &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
