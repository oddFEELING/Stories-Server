import { model, Schema } from "mongoose";
import { Story } from "./_db.types";

const StorySchema = new Schema<Story>(
  {
    title: { type: String, required: true },
    story_title: String,
    passage: String,
    initialized: { type: Boolean, default: false },
    summary: String,
    public: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    story_art: {
      prompt: String,
      image_url: {
        type: String,
        required: true,
        default:
          "https://images.unsplash.com/photo-1578301978961-a526d6fb0d54?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGFydHxlbnwwfHwwfHx8MA%3D%3D",
      },
    },

    // ~ ======= init options  -->
    initOptions: {
      mode: {
        type: String,
        enum: ["generated", "original"],
        default: "generated",
      },
      genre: {
        type: String,
        enum: ["fantasy", "sci-fi", "mystery", "horror", "romance"],
        default: "fantasy",
      },
      length: {
        type: String,
        enum: ["short", "medium", "long"],
        default: "short",
      },
      timePeriod: {
        type: String,
        enum: ["modern", "historical", "space-age", "magical", "null"],
        default: "modern",
      },
    },

    // ~ =============================================>
    // ~ ======= Chapter details  -->
    // ~ =============================================>
    chapters: [
      {
        title: String,
        tagline: String,
        audio_url: String,
        chapter_number: { type: Number, required: true },
        content: {
          raw: String,
          markdown: String,
        },
        setup: {
          pov_character: String,
          synopsis: String,
          scenes: [
            {
              goal: String,
              setting: String,
              characters: [String],
              conflict: String,
              outcome: String,
              plot_points: [String],
            },
          ],
        },
      },
    ],

    setup: {
      /// ~ =============================================>
      // ~ ======= story analyses  -->
      // ~ =============================================>
      storyAnalysis: {
        original_story_elements: {
          core_characters: {
            role: String,
            significance: String,
            key_relationships: [String],
          },
          plot_points: [
            {
              event: String,
              significance: String,
              dramatic_potential: String,
            },
          ],
          setting_context: String,
          central_themes: [{ theme: String, significance: String }],
        },
        adaptation_opportunities: [
          { expansion_points: [String], potential_challenges: [String] },
        ],
      },

      // ~ =============================================>
      // ~ ======= character development  -->
      // ~ =============================================>
      characterDevelopment: {
        character_profiles: [
          {
            new_name: String,
            biblical_role: {
              original_name: String,
              role_description: String,
              key_actions: [String],
            },
            back_story: {
              personal_history: String,
              family_dynamics: String,
              formative_experiences: [String],
            },
            core_traits: [
              {
                personality: String,
                motivations: [String],
                conflicts: [String],
                unique_qualities: [String],
              },
            ],
          },
        ],
        character_arcs: {
          protagonist: {
            name: String,
            development_summary: String,
            key_moments: [
              {
                moment: String,
                impact: String,
                biblical_parallel: String,
              },
            ],
          },
          supporting_casts: [
            {
              name: String,
              arc_summary: String,
              relationship_dynamics: [{ character: String, dynamic: String }],
            },
          ],
        },
      },

      // ~ =============================================>
      // ~ ======= plot expansion  -->
      // ~ =============================================>
      plotExpansion: {
        main_plot: {
          plot_points: [
            {
              event: String,
              significance: String,
              characters_involved: [String],
              emotional_impact: String,
            },
          ],
          climatic_moments: [
            {
              moment: String,
              impact: String,
              build_up: String,
            },
          ],
          creative_additions: [
            {
              type: {
                type: String,
                enum: ["scene", "conflict", "plot_twist", "modern_element"],
              },
              description: String,
              purpose: String,
            },
          ],
        },
        sub_plots: [
          {
            title: String,
            description: String,
            connected_characters: [String],
            main_plot_connections: [
              {
                connection_point: String,
                story_impact: String,
              },
            ],
          },
        ],
        narrative_structure: {
          pacing_notes: [String],
          theme_integration: String,
          story_arcs: [{ arc_description: String, resolution: String }],
        },
      },

      // ~ =============================================>
      // ~ ======= world builder   -->
      // ~ =============================================>
      worldBuilder: {
        physical_environment: {
          locations: [
            {
              name: String,
              description: String,
              significance: String,
              atmosphere: String,
              notable_features: [String],
            },
          ],
          geography: {
            landscape: String,
            climate: String,
            natural_resources: String,
          },
        },
        cultural_elements: [
          {
            societies: [
              {
                name: String,
                structure: String,
                traditions: [String],
                beliefs: [String],
                daily_life: String,
              },
            ],
          },
        ],
        social_systems: [
          {
            government: String,
            laws: [String],
            economy: String,
            social_classes: [String],
          },
        ],
      },

      // ~ =============================================>
      // ~ ======= Theme weaver  -->
      // ~ =============================================>
      themeWeaver: {
        central_theme: {
          theme: String,
          description: String,
          biblical_connections: String,
          modern_relevance: String,
          development: [String],
        },
        thematic_progression: [
          {
            story_phase: String,
            thematic_focus: String,
            development_strategy: String,
          },
        ],
        supporting_casts: [String],
      },
    },
  },
  {
    collection: "stories",
    timestamps: true,
  },
);

const StoryModel = model<Story>("stories", StorySchema);

export default StoryModel;
