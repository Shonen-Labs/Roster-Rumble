use contracts::ScoringEngine::IScoringEngineDispatcherTrait;
use snforge_std::EventSpyAssertionsTrait;
use starknet::{ContractAddress, contract_address_const};

use snforge_std::{
    declare, ContractClassTrait, DeclareResultTrait, spy_events, start_cheat_caller_address,
    stop_cheat_caller_address,
};

use contracts::ScoringEngine::{IScoringEngineDispatcher, ScoringEngine};

fn deploy_contract() -> ContractAddress {
    let contract = declare("ScoringEngine").unwrap().contract_class();
    let oracle_address = contract_address_const::<'oracle_address'>();
    let constructor_calldata = array![oracle_address.into()];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    contract_address
}

#[test]
fn test_update_scores() {
    let oracle_address = contract_address_const::<'oracle_address'>();
    let contract_address = deploy_contract();
    let dispatcher = IScoringEngineDispatcher { contract_address };
    let mut spy = spy_events();

    start_cheat_caller_address(contract_address, oracle_address);
    let player_id = contract_address_const::<'player1'>();
    let updated_scores = array![(player_id, (1, 1, 0))];
    dispatcher.update_scores(updated_scores);
    stop_cheat_caller_address(contract_address);

    let expected_event = ScoringEngine::Event::ScoreUpdated(
        ScoringEngine::ScoreUpdated { player_id, new_score: 8 },
    );
    spy.assert_emitted(@array![(contract_address, expected_event)]);
}
