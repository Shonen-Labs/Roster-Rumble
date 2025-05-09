#[starknet::interface]
pub trait IScoringEngine<TContractState> {
    fn update_scores(ref self: TContractState, updates: Array<(starknet::ContractAddress, (u64, u64, u64))>);
}

#[starknet::contract]
pub mod ScoringEngine {
    use starknet::{ContractAddress, get_caller_address};
    use starknet::storage::{Map, StoragePathEntry, StoragePointerReadAccess, StoragePointerWriteAccess};
    use super::IScoringEngine;

    #[storage]
    struct Storage {
        player_performance_stats: Map<ContractAddress, (u64, u64, u64)>,
        player_scores: Map<ContractAddress, u64>,
        oracle_address: ContractAddress
    }

    #[event]
    #[derive(Drop, Serde, starknet::Event)]
    pub enum Event {
        ScoreUpdated: ScoreUpdated
    }

    #[derive(Drop, Serde, starknet::Event)]
    pub struct ScoreUpdated {
        pub player_id: ContractAddress,
        pub new_score: u64
    }

    #[constructor]
    fn constructor(ref self: ContractState, oracle_address: ContractAddress) {
        self.oracle_address.write(oracle_address);
    }

    #[abi(embed_v0)]
    impl IScoringEngineImpl of IScoringEngine<ContractState> {
        fn update_scores(ref self: ContractState, updates: Array<(ContractAddress, (u64, u64, u64))>) {
            // Oracle access control
            assert(get_caller_address() == self.oracle_address.read(), 'Unauthorized');
    
            for (player_id, (goals, assists, clean_sheet)) in updates {
                self.player_performance_stats.entry(player_id).write((goals, assists, clean_sheet));
                let new_score = (goals * 5) + (assists * 3) + (clean_sheet * 2);
                self.player_scores.entry(player_id).write(new_score);
                self.emit(Event::ScoreUpdated(ScoreUpdated {
                    player_id,
                    new_score
                }));
            }
        }
    }
}