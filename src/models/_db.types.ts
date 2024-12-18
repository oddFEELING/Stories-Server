import { Document, ObjectId } from "mongoose";
import { z } from "zod";

// ~ =============================================>
// ~ ======= User Schema   -->
// ~ =============================================>
interface User extends Document {
  first_name: string;
  last_name: string;
  other_names?: string;
  email: string;
  zap_cells: number;
  profile_img: string;
  auth_id: string;
  roles: ("user" | "mod" | "admin")[];
}

const zodUserSchema = z.custom<User>();

// ~ =============================================>
// ~ ======= bible study series type   -->
// ~ =============================================>
type StudySeries = {
  name: string;
  theme: string;
  duration: string;
  interval: string;
  start_date: string;
  sessions: {
    title: string;
    passage: string;
    cover: string;
    questions: string[];
  }[];
};

// ~ =============================================>
// ~ ======= Study group type  -->
// ~ =============================================>
interface StudyGroup {
  name: string;
  creator: ObjectId;
  members: string;
  series: StudySeries;
}

// ~ =============================================>
// ~ ======= Story Schema   -->
// ~ =============================================>
interface Story extends Document {
  createdAt: string;
  updatedAt: string;
  initialized: boolean;
  title: string;
  story_title: string;
  public: boolean;
  summary: string;
  passage: string;
  story_art: {
    prompt: string;
    image_url: string;
  };
  owner: ObjectId;
  chapters: {
    title: string;
    tagline: string;
    chapter_number: number; // number of the chapter in the list
    audio_url: string; // keep this as an empty string
    content: { raw: string; markdown: string }; // Markdown and text String containing the content of the chapter.
    setup: {
      pov_character: string; // character whose perspective drives the chapter
      synopsis: string; // brief summary of the chapter's content
      scenes: {
        goal: string; // what needs to be accomplished in this scene
        setting: string; // where the scene takes place
        characters: string[]; // characters involved in the scene
        conflict: string; // Main tension or obstacle
        outcome: string; // resolution or consequence of the scene
        plot_points: string[]; // key plot points that need to be addressed in the scene
      }[];
    };
  }[];

  initOptions: {
    mode: "generated" | "original";
    genre: "fantasy" | "sci-fi" | "mystery" | "horror" | "romance";
    length: "short" | "medium" | "long";
    timePeriod: "modern" | "historical" | "space-age" | "magical";
  };

  setup: {
    // ~ ======= storyAnalysis -->
    storyAnalysis: {
      original_story_elements: {
        core_characters: {
          role: string; // role in biblical narrative
          significance: string; // importance to the story
          key_relationships: string[]; //Essential relationships
        }[];
        plot_points: {
          event: string; // Key event to preserve
          significance: string; // Importance to the story
          dramatic_potential: string; // DOpportunities for enhancement
        }[];
        setting_context: string; // Essential setting context
        central_themes: {
          theme: string; // Central theme
          significance: string; // Importance to the story
        }[];
      };
      adaptation_opportunities: {
        expansion_points: string[]; // Story elements that can be expanded
        potential_challenges: string[]; // Potential challenges
      }[];
    };

    // ~ ======= Character development -->
    characterDevelopment: {
      character_profiles: {
        new_name: string; // New, original character name
        biblical_role: {
          original_name: string; // Biblical character name
          role_description: string; // Role in biblical narrative
          key_actions: string[]; // important actions/events from biblical narrative
        };
        back_story: {
          personal_history: string; // Reimagined character history and background
          family_dynamics: string; // Family relationships and influences
          formative_experiences: string[]; // Key events that shaped the character
        };
        core_traits: {
          personality: string; // Personality traits
          motivations: string[]; // Primary drives and goals
          conflicts: string[]; // Internal and external struggles
          unique_qualities: string[]; // Distinctive traits that set them apart
        };
      }[];

      character_arcs: {
        protagonist: {
          name: string;
          development_summary: string; // overview of character growth and development
          key_moments: {
            moment: string; // Key moments in the character's journey
            impact: string; // Significant changes or realizations
            biblical_parallel: string; // Connection to original biblical narrative
          }[];
        };
        supporting_casts: {
          name: string;
          arc_summary: string; // brief summary of character development
          relationship_dynamics: {
            character: string; // Character name
            dynamic: string; // nature of relationship and its evolution
          }[];
        }[];
      };
    };

    // ~ ======= plot expansion -->
    plotExpansion: {
      main_plot: {
        plot_points: {
          event: string; // description of plot event
          significance: string; // importance and meaning of the event
          characters_involved: string[]; // characters participating in event
          emotional_impact: string; // emotional effect on characters/story
        }[];
        climatic_moments: {
          moment: string; // description of climactic story moment
          impact: string; // effect on story and characters
          build_up: string; // events leading to this moment
        }[];
        creative_additions: {
          type: "scene" | "conflict" | "plot_twist" | "modern_element";
          description: string; // detailed description of the addition
          purpose: string; // reason for including this element
        }[];
      };

      sub_plots: {
        title: string; // name of the subplot
        description: string; // overview of subplot narrative
        connected_characters: string[]; // characters involved in subplot
        main_plot_connections: {
          connection_point: string; // where subplot connects to main plot
          story_impact: string; // how subplot affects overall story
        }[];
      }[];

      narrative_structure: {
        pacing_notes: string[]; // notes on story rhythm and flow
        theme_integration: string; // how themes are woven into plot
        story_arcs: {
          arc_description: string; // description of story arc
          resolution: string; // how arc concludes
        }[];
      };
    };

    // ~ ======= World builder -->
    worldBuilder: {
      physical_environment: {
        locations: {
          name: string;
          description: string; // Detailed description of the location
          significance: string; // Location's importance to the story
          atmosphere: string; // Mood and feeling of the location
          notable_features: string[]; // Distinctive physical characteristics
        }[];
        geography: {
          landscape: string; // General terrain and natural features
          climate: string; // Weather patterns and environmental conditions
          natural_resources: string; // Available resources that impact society
        };
      };

      cultural_elements: {
        societies: {
          name: string;
          structure: string; // Social hierarchy and organization
          traditions: string[]; // Important customs and practices
          beliefs: string[]; // Religious or philosophical systems
          daily_life: string; // Day-to-day activities and routines
        }[];
      }[];

      social_systems: {
        government: string; // Political structure and leadership
        laws: string[]; // Key rules and regulations
        economy: string; // Economic system and trade
        social_classes: string[]; // Class divisions and relationships
      }[];
    };

    // ~ ======= Theme weaver -->
    themeWeaver: {
      central_theme: {
        theme: string; // Core thematic concept of the story
        description: string; // Detailed explanation of the central theme
        biblical_connections: string; // How theme relates to biblical narratives/principles
        modern_relevance: string; // Theme's application to contemporary issues
        development: string[]; // Key points showing theme's evolution through story
      };
      thematic_progression: {
        story_phase: string; // Specific part of story where theme develops
        thematic_focus: string; // Particular aspect of theme emphasized
        development_strategy: string; // How theme is conveyed in this phase
      }[];
      supporting_themes: string[]; // Secondary themes that reinforce central theme
    };
  };
}

const zodStorySchema = z.custom<Story>();

export {
  type User,
  type Story,
  zodUserSchema,
  zodStorySchema,
  type StudySeries,
  type StudyGroup,
};
