package store.dalkak.api.recommend.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class FastRefrigeratorDto {

    List<List<Long>> result;
}
